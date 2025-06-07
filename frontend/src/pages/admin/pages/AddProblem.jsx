import React, { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import { useProblemStore } from '@/store/problemStore';
import { useCompanyStore } from '@/store/companyStore';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, FileText, Plus, ChevronUp, ChevronDown, Upload, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { sampleProblems } from '@/data/sampleProblems';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Import form libraries
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload as UploadApi } from '@/api/api';
import { cn } from '@/lib/utils';

// Import necessary shadcn components for dropdown and dialog
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

// Updated language order and icons
const SUPPORTED_LANGUAGES = ['JAVASCRIPT', 'PYTHON', 'CPP', 'JAVA'];

const languageIcons = {
  JAVASCRIPT: 'https://skillicons.dev/icons?i=js',
  PYTHON: 'https://skillicons.dev/icons?i=py',
  CPP: 'https://skillicons.dev/icons?i=cpp',
  JAVA: 'https://skillicons.dev/icons?i=java',
};

// Define Zod schema for problem data
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(['easy', 'medium', 'hard'], "Invalid difficulty"),
  companyIds: z.array(z.string().uuid("Invalid company ID")).optional(),
  tags: z.string().nullable().optional(),
  constraints: z.string().nullable().optional(),
  examples: z.record(z.string(), z.array(z.object({
    input: z.string().nullable().optional(),
    output: z.string().nullable().optional(),
    explanation: z.string().nullable().optional(),
  }))).optional(),
  testCases: z.array(z.object({
    input: z.string().nullable().optional(),
    output: z.string().nullable().optional(),
  })).optional(),
  codeSnippets: z.record(z.string(), z.string().nullable().optional()).optional(),
  reference_solution: z.record(z.string(), z.string().nullable().optional()).optional(),
  hints: z.array(z.string().min(1, "Hint cannot be empty")).optional(),
  problemImage: z.object({
    url: z.string(),
    fileId: z.string()
  }).nullable().optional() // Make problemImage optional and nullable
});

const AddProblem = () => {
  const navigate = useNavigate();
  const { createProblem, isCreating } = useProblemStore();
  const { getAllCompanies, companies, isLoading: isLoadingCompanies, createCompany, isCreating: isCreatingCompany } = useCompanyStore();
  const [selectedLanguages, setSelectedLanguages] = useState(['JAVASCRIPT']);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [problemImage, setProblemImage] = useState(null);
  const [openExamples, setOpenExamples] = useState({});
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      companyIds: [],
      tags: '',
      constraints: '',
      examples: Object.fromEntries(SUPPORTED_LANGUAGES.map(lang => [lang, [{ input: '', output: '', explanation: '' }]])),
      testCases: [
        {
          input: '',
          output: ''
        }
      ],
      codeSnippets: {},
      reference_solution: Object.fromEntries(SUPPORTED_LANGUAGES.map(lang => [lang, ''])),
      hints: [''],
      problemImage: null
    },
  });

  const { watch, setValue, reset } = form;
  const watchedTestCases = watch('testCases');
  const watchedProblemImage = watch('problemImage');


  useEffect(() => {
    getAllCompanies();
  }, []);

  // Initialize selected companies from form data when component mounts or companies load
  useEffect(() => {
    const initialCompanyIds = form.getValues('companyIds');
    if (initialCompanyIds && Array.isArray(initialCompanyIds)) {
      setSelectedCompanies(initialCompanyIds);
    }
  }, [companies]); // Re-run when companies data changes

  useEffect(() => {
    setProblemImage(watchedProblemImage);
  }, [watchedProblemImage]);


  const handleLanguageToggle = (language) => {
    setSelectedLanguages(prev => {
      if (prev.includes(language)) {
        // Remove language from the selected list
        // Do NOT explicitly set form values to undefined here
        return prev.filter(lang => lang !== language);
      } else {
        // Add language to the selected list
        // Explicitly set default values for the added language
        setValue(`codeSnippets.${language}`, '');
        setValue(`reference_solution.${language}`, '', { shouldDirty: true });
        setValue(`examples.${language}`, [{ input: '', output: '', explanation: '' }]);
        // Open the first example by default when adding a new language
        setOpenExamples(prevOpen => ({
          ...prevOpen,
          [`${language}-0`]: true,
        }));
        return [...prev, language];
      }
    });
  };

  const handleEditorChange = (value, field, language) => {
    setValue(`${field}.${language}`, value);
  };

  const removeTestCase = (index) => {
    const currentTestCases = form.getValues('testCases');
    const newTestCases = currentTestCases.filter((_, i) => i !== index);
    setValue('testCases', newTestCases);
  };

  const addTestCase = () => {
     const currentTestCases = form.getValues('testCases');
     setValue('testCases', [...currentTestCases, { input: '', output: '' }]);
  }

  const loadSampleData = (index) => {
    const sample = sampleProblems[index];
    if (!sample) return;

    // Reset form with sample data
    reset({
      title: sample.title,
      description: sample.description,
      difficulty: sample.difficulty,
      tags: sample.tags.join(', '),
      constraints: sample.constraints.join(', '),
      examples: sample.examples,
      testCases: sample.testCases,
      codeSnippets: sample.codeSnippets,
      reference_solution: sample.reference_solution,
      hints: [''],
      problemImage: null
    });

    // Set selected languages based on sample data code snippets keys
    setSelectedLanguages(Object.keys(sample.codeSnippets || {}));
    
    // Set current sample index
    setCurrentSampleIndex(index);
  };

  // Add this function to load next sample
  const loadNextSample = () => {
    const nextIndex = (currentSampleIndex + 1) % sampleProblems.length;
    loadSampleData(nextIndex);
  };

  // Add this function to load previous sample
  const loadPreviousSample = () => {
    const prevIndex = (currentSampleIndex - 1 + sampleProblems.length) % sampleProblems.length;
    loadSampleData(prevIndex);
  };

  // Handle company selection
  const handleCompanySelection = (companyId) => {
    setSelectedCompanies(prev => {
      const newSelection = prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId];

      // Update form value after state change
      form.setValue('companyIds', newSelection, { shouldDirty: true });
      console.log('Updated selected companies:', newSelection);
      return newSelection;
    });
  };


  const onSubmit = async (data) => {
    try {
      console.log('Form data before processing:', data);
      console.log('Selected companies state:', selectedCompanies);

      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        constraints: data.constraints ? data.constraints.split(',').map(constraint => constraint.trim()).filter(constraint => constraint) : [],
        companyIds: selectedCompanies, // Use the state value directly
        problemImage: problemImage // Use the state value for problem image
      };

      console.log('Processed data with companies and image:', processedData);

      // Process examples to ensure they are arrays and filter out undefined/empty
      processedData.examples = Object.fromEntries(
        Object.entries(processedData.examples || {})
          .filter(([_, v]) => v !== undefined)
          .map(([lang, examples]) => [lang, Array.isArray(examples) ? examples.filter(ex => ex.input || ex.output || ex.explanation) : []])
          .filter(([_, examples]) => examples.length > 0)
      );


      // Process code snippets, filter out undefined/empty
      processedData.codeSnippets = Object.fromEntries(
        Object.entries(processedData.codeSnippets || {})
          .filter(([_, v]) => v !== undefined && v.trim() !== '')
      );

      // Process reference solutions to ensure they are strings and filter out empty
      processedData.reference_solution = Object.fromEntries(
        Object.entries(processedData.reference_solution || {})
          .map(([lang, solution]) => [lang, solution || ''])
          .filter(([_, v]) => v.trim() !== '')
      );


      // Process test cases, filter out undefined/empty
      processedData.testCases = processedData.testCases
        ? processedData.testCases.filter(tc => tc.input || tc.output)
        : [];


      // Process hints, filter out undefined/empty
      processedData.hints = processedData.hints
        ? processedData.hints.filter(hint => hint.trim() !== '')
        : [];


      console.log('Final processed data:', processedData);

      const result = await createProblem(processedData);
      console.log('Create problem result:', result);

      if (result) {
        toast.success('Problem created successfully');
        navigate('/admin/all-problems');
      } else {
        toast.error('Failed to create problem');
      }
    } catch (error) {
      console.error('Error creating problem:', error);
      toast.error(error.message || 'Failed to create problem');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      setUploadProgress(true);
      let companyUrl = null;

      // If file is selected, upload it first
      if (selectedFile) {
        try {
          // Upload file to backend
          const { data: uploadResult } = await UploadApi.upload(selectedFile);
          console.log("Upload result:", uploadResult);

          if (uploadResult.success) {
            companyUrl = {
              url: uploadResult.url,
              fileId: uploadResult.fileId
            };
          } else {
            throw new Error(uploadResult.message || "Upload failed");
          }
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          toast.error("Error uploading company logo");
          setUploadProgress(false);
          return;
        }
      }

      // Create company with logo URL
      await createCompany({
        name: newCompanyName.trim(),
        companyUrl
      });

      await getAllCompanies();
      setNewCompanyName('');
      setSelectedFile(null);
      setIsDialogOpen(false);
      toast.success("Company created successfully");
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Error creating company");
    } finally {
      setUploadProgress(false);
    }
  };

  // Handle problem image upload
  const handleProblemImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadProgress(true);
      const { data: uploadResult } = await UploadApi.upload(file);

      if (uploadResult.success) {
        setProblemImage({
          url: uploadResult.url,
          fileId: uploadResult.fileId
        });
        form.setValue('problemImage', {
          url: uploadResult.url,
          fileId: uploadResult.fileId
        });
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setUploadProgress(false);
    }
  };

  // Handle adding new example for a language
  const addExample = (language) => {
    const currentExamples = form.getValues(`examples.${language}`) || [];
    if (!Array.isArray(currentExamples)) {
      form.setValue(`examples.${language}`, []);
    }
    const newExamples = [
      ...(Array.isArray(currentExamples) ? currentExamples : []),
      { input: '', output: '', explanation: '' }
    ];
    form.setValue(`examples.${language}`, newExamples);
    // Open the newly added example by default
    setOpenExamples(prev => ({
      ...prev,
      [`${language}-${newExamples.length - 1}`]: true
    }));
  };


  // Handle removing an example
  const removeExample = (language, index) => {
    const currentExamples = form.getValues(`examples.${language}`) || [];
    if (!Array.isArray(currentExamples)) {
      form.setValue(`examples.${language}`, []);
      return;
    }
    const newExamples = currentExamples.filter((_, i) => i !== index);
    form.setValue(`examples.${language}`, newExamples);
    // Close the removed example and ensure at least one is open if others exist
    setOpenExamples(prev => {
      const newState = { ...prev };
      delete newState[`${language}-${index}`];
      // Adjust indices of examples after the removed one
      const reindexedState = {};
      Object.keys(newState).forEach(key => {
        const [lang, oldIndex] = key.split('-');
        const oldIndexInt = parseInt(oldIndex, 10);
        if (lang === language && oldIndexInt > index) {
          reindexedState[`${language}-${oldIndexInt - 1}`] = newState[key];
        } else {
          reindexedState[key] = newState[key];
        }
      });

      // Ensure at least one example is open if there are examples left
      if (newExamples.length > 0 && Object.keys(reindexedState).filter(key => key.startsWith(`${language}-`)).every(key => !reindexedState[key])) {
         reindexedState[`${language}-0`] = true; // Open the first example
      }


      return reindexedState;
    });
  };

  // Handle adding new reference solution for a language
  const addReferenceSolution = (language) => {
    const currentSolutions = form.getValues(`reference_solution.${language}`) || [];
     // Reference solution is a single string per language, no need to add multiple
     console.warn("Attempted to add multiple reference solutions. Reference solution is a single string per language.");
  };

  // Handle removing a reference solution
  const removeReferenceSolution = (language, index) => {
    // Reference solution is a single string per language, no need to remove
    console.warn("Attempted to remove reference solution. Reference solution is a single string per language.");
  };

  // Add a function to toggle example visibility
  const toggleExample = (language, index) => {
    setOpenExamples(prev => ({
      ...prev,
      [`${language}-${index}`]: !prev[`${language}-${index}`]
    }));
  };

  // Effect to ensure the first example of each selected language is open by default
  useEffect(() => {
    const initialOpenExamples = {};
    selectedLanguages.forEach(lang => {
      const examples = form.getValues(`examples.${lang}`);
       if (Array.isArray(examples) && examples.length > 0) {
        // Check if any example is already open for this language
        const anyOpen = Object.keys(openExamples).some(key => key.startsWith(`${lang}-`) && openExamples[key]);
        if (!anyOpen) {
           initialOpenExamples[`${lang}-0`] = true;
        }
       }
    });
    setOpenExamples(prev => ({ ...prev, ...initialOpenExamples }));
  }, [selectedLanguages, form.getValues('examples')]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Add New Problem</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => loadPreviousSample()}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => loadSampleData(currentSampleIndex)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Load Sample {currentSampleIndex + 1}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => loadNextSample()}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Two Sum" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Company Selection Section */}
                    <FormField
                      control={form.control}
                      name="companyIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Companies</FormLabel>
                          <div className="flex items-center gap-2">
                            {/* Company Selection Dropdown */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-64 justify-between", // Adjusted width
                                      !field.value || field.value.length === 0 && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value && field.value.length > 0
                                      ? `${field.value.length} companies selected`
                                      : "Select companies"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-0"> {/* Adjusted width */}
                                <Command>
                                  <CommandInput placeholder="Search companies..." />
                                  <CommandEmpty>No companies found.</CommandEmpty>
                                  <CommandGroup className="max-h-64 overflow-auto">
                                    {companies.map((company) => (
                                      <CommandItem
                                        key={company.id}
                                        value={company.name}
                                        onSelect={() => {
                                          const currentValue = field.value || [];
                                          const newValue = currentValue.includes(company.id)
                                            ? currentValue.filter(id => id !== company.id)
                                            : [...currentValue, company.id];
                                          field.onChange(newValue);
                                          setSelectedCompanies(newValue);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value?.includes(company.id) ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          <Avatar className="h-6 w-6">
                                            {company.companyUrl?.url?.url ? (
                                              <AvatarImage src={company.companyUrl.url.url} alt={company.name} />
                                            ) : (
                                              <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                                            )}
                                          </Avatar>
                                          <span>{company.name}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>

                            {/* Add New Company Dialog Trigger */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon" type="button">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add New Company</DialogTitle>
                                  <DialogDescription>
                                    Enter the name of the new company and upload a logo (optional).
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                  <Input
                                    placeholder="Company name"
                                    value={newCompanyName}
                                    onChange={(e) => setNewCompanyName(e.target.value)}
                                  />
                                  <div className="space-y-2">
                                    <Label>Company Logo (Optional)</Label>
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleFileChange}
                                    />
                                    {selectedFile && (
                                      <p className="text-sm text-muted-foreground">
                                        Selected file: {selectedFile.name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsDialogOpen(false);
                                      setSelectedFile(null);
                                    }}
                                    type="button"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleCreateCompany}
                                    disabled={isCreatingCompany || uploadProgress}
                                    type="button"
                                  >
                                    {isCreatingCompany || uploadProgress ? "Creating..." : "Create Company"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma-separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., array, string, dynamic-programming" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="constraints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Constraints (comma-separated)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., 1 <= n <= 100, 1 <= arr[i] <= 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hints section */}
                  <FormField
                    control={form.control}
                    name="hints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hints</FormLabel>
                        <div className="space-y-2">
                          {(field.value || [""]).map((hint, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <Input
                                value={hint}
                                onChange={e => {
                                  const newHints = [...field.value];
                                  newHints[idx] = e.target.value;
                                  field.onChange(newHints);
                                }}
                                placeholder={`Hint ${idx + 1}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newHints = field.value.filter((_, i) => i !== idx);
                                  field.onChange(newHints.length ? newHints : [""]);
                                }}
                                disabled={(field.value?.length || 1) === 1}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => field.onChange([...(field.value || [""]), ""])}
                          >
                            Add Hint
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write a description..." className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Test Cases</Label>
                     {watchedTestCases && watchedTestCases.map((testCase, index) => (
                      <div key={index} className="flex gap-2 items-start">
                         <FormField
                            control={form.control}
                            name={`testCases.${index}.input`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                   <Input placeholder="Input" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`testCases.${index}.output`}
                             render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                   <Input placeholder="Output" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTestCase(index)}
                          className="h-10 w-10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTestCase}
                    >
                      Add Test Case
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem Image Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Problem Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="problemImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center space-y-4">
                           <div className="relative w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                            {problemImage ? (
                              <>
                                <img
                                  src={problemImage.url}
                                  alt="Problem"
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 z-10"
                                  onClick={() => {
                                    setProblemImage(null);
                                    form.setValue('problemImage', null);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <ImageIcon className="h-10 w-10" />
                                <span className="text-base">No image uploaded</span>
                              </div>
                            )}
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleProblemImageUpload}
                            disabled={uploadProgress}
                            className="hidden"
                            id="problem-image-upload"
                          />
                          <Label
                            htmlFor="problem-image-upload"
                            className={cn(
                              "flex items-center justify-center gap-2 cursor-pointer w-full",
                              uploadProgress && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              disabled={uploadProgress}
                              onClick={() => document.getElementById('problem-image-upload').click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {uploadProgress ? "Uploading..." : "Select Image"}
                            </Button>
                          </Label>
                          {problemImage && (
                             <p className="text-sm text-muted-foreground">
                               Image uploaded: {problemImage.url.split('/').pop()}
                             </p>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>


          </div>
        </div>

        {/* Code Editor Section */}
        <div className="border-t bg-muted/50 rounded-xl">
          <div className="rounded-lg">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Label>Supported Languages</Label>
                <div className="flex gap-2">
                  {SUPPORTED_LANGUAGES.map(language => (
                    <Button
                      key={language}
                      type="button"
                      variant={selectedLanguages.includes(language) ? "default" : "outline"}
                      onClick={() => handleLanguageToggle(language)}
                      className="flex items-center gap-1"
                    >
                      <img src={languageIcons[language]} alt={`${language} icon`} className="h-5 w-5" />
                      {language}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-6">
                {selectedLanguages.map(language => (
                  <div key={language} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Examples for {language}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addExample(language)}
                      >
                        Add Example
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(() => {
                        const examples = form.watch(`examples.${language}`);
                        const examplesArray = Array.isArray(examples) ? examples : [];
                        return examplesArray.map((_, exampleIndex) => (
                          <div key={exampleIndex} className="border rounded-lg">
                            <div
                              className="p-4 flex justify-between items-center cursor-pointer"
                              onClick={() => toggleExample(language, exampleIndex)}
                            >
                              <Label>Example {exampleIndex + 1}</Label>
                              <div className="flex items-center gap-2">
                                {/* Only show remove button if there is more than one example */}
                                {examplesArray.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent toggling example visibility
                                      removeExample(language, exampleIndex);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                >
                                  {openExamples[`${language}-${exampleIndex}`] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            {openExamples[`${language}-${exampleIndex}`] && (
                              <div className="p-4 space-y-4 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`examples.${language}.${exampleIndex}.input`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Input</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Enter input" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`examples.${language}.${exampleIndex}.output`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Output</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Enter output" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`examples.${language}.${exampleIndex}.explanation`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Explanation</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="Enter explanation" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        ));
                      })()}
                    </div>

                    <FormField
                      control={form.control}
                      name={`codeSnippets.${language}`}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Code Snippet ({language})</FormLabel>
                          <FormControl>
                            <Editor
                              height="200px"
                              defaultLanguage={language.toLowerCase()}
                              value={field.value || ''}
                              onChange={field.onChange}
                              theme="vs-dark"
                              options={{
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`reference_solution.${language}`}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Reference Solution ({language})</FormLabel>
                          <FormControl>
                            <Editor
                              height="200px"
                              defaultLanguage={language.toLowerCase()}
                              value={field.value || ''}
                              onChange={(value) => {
                                field.onChange(value || '');
                              }}
                              theme="vs-dark"
                              options={{
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full"
                onClick={() => {
                  console.log('Submit button clicked');
                  console.log('Form values:', form.getValues());
                  console.log('Selected companies:', selectedCompanies);
                }}
              >
                {isCreating ? 'Creating...' : 'Create Problem'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddProblem;