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
import { X, FileText, Plus } from 'lucide-react';
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
import { Upload } from '@/api/api';


// Updated language order and icons
const SUPPORTED_LANGUAGES = ['JAVASCRIPT', 'PYTHON', 'C++', 'JAVA'];

const languageIcons = {
  JAVASCRIPT: 'https://skillicons.dev/icons?i=js',
  PYTHON: 'https://skillicons.dev/icons?i=py',
  'C++': 'https://skillicons.dev/icons?i=cpp',
  JAVA: 'https://skillicons.dev/icons?i=java',
};

// Define Zod schema for problem data
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(['easy', 'medium', 'hard'], "Invalid difficulty"),
  companyId: z.string().uuid("Invalid company ID").nullable().optional(),
  tags: z.string().nullable().optional(),
  constraints: z.string().nullable().optional(),
  examples: z.record(z.string(), z.object({
    input: z.string().nullable().optional(),
    output: z.string().nullable().optional(),
    explanation: z.string().nullable().optional(),
  })).optional(),
  testCases: z.array(z.object({
    input: z.string().nullable().optional(),
    output: z.string().nullable().optional(),
  })).optional(),
  codeSnippets: z.record(z.string(), z.string().nullable().optional()).optional(),
  reference_solution: z.record(z.string(), z.string().nullable().optional()).optional(),
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

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      companyId: null,
      tags: '',
      constraints: '',
      examples: {},
      testCases: [
        {
          input: '',
          output: ''
        }
      ],
      codeSnippets: {},
      reference_solution: {}
    },
  });

  const { watch, setValue, reset } = form;
  const watchedTestCases = watch('testCases');



  useEffect(() => {
    getAllCompanies();
  }, []);

  const handleLanguageToggle = (language) => {
    setSelectedLanguages(prev => {
      if (prev.includes(language)) {
        // Remove language data from form state
        setTimeout(() => {
          setValue(`codeSnippets.${language}`, undefined, { shouldDirty: true });
          setValue(`reference_solution.${language}`, undefined, { shouldDirty: true });
          setValue(`examples.${language}`, undefined, { shouldDirty: true });
        }, 0);

        return prev.filter(lang => lang !== language);
      } else {
        // Add language data with empty defaults to form state
        setValue(`codeSnippets.${language}`, '');
        setValue(`reference_solution.${language}`, '');
        setValue(`examples.${language}`, {
          input: '',
          output: '',
          explanation: ''
        });
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

  const loadSampleData = (sample) => {
    // Reset form with sample data
    reset(sample);
    // Set selected languages based on sample data code snippets keys
    setSelectedLanguages(Object.keys(sample.codeSnippets || {}));
  };

  const onSubmit = async (data) => {
    try {
      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        constraints: data.constraints ? data.constraints.split(',').map(constraint => constraint.trim()).filter(constraint => constraint) : [],
         // Ensure companyId is null if empty string
        companyId: data.companyId === '' ? null : data.companyId,
      };

      // Filter out undefined values from nested objects (due to language toggle logic)
      processedData.examples = Object.fromEntries(
        Object.entries(processedData.examples || {}).filter(([_, v]) => v !== undefined)
      );
       processedData.codeSnippets = Object.fromEntries(
        Object.entries(processedData.codeSnippets || {}).filter(([_, v]) => v !== undefined)
      );
       processedData.reference_solution = Object.fromEntries(
        Object.entries(processedData.reference_solution || {}).filter(([_, v]) => v !== undefined)
      );


      await createProblem(processedData);
      navigate('/admin/all-problems');
    } catch (error) {
      console.error('Error creating problem:', error);
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
          const { data: uploadResult } = await Upload.upload(selectedFile);
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
                    {sampleProblems.map((sample, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadSampleData(sample)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Sample {index + 1}
                      </Button>
                    ))}
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

                    <FormField
                      control={form.control}
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <div className="flex gap-2">
                            <Select
                              onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                              value={field.value === null ? "null" : field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select company" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {companies.map(company => (
                                  <SelectItem key={company.id} value={company.id}>
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        {company.companyUrl?.url ? (
                                          <AvatarImage src={company.companyUrl.url.url} alt={company.name} />
                                        ) : (
                                          <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                                        )}
                                      </Avatar>
                                      <span>{company.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
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
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleCreateCompany}
                                    disabled={isCreatingCompany || uploadProgress}
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
                     <div className="space-y-2">
                      <Label>Example for {language}</Label>
                       <div className="grid grid-cols-2 gap-4">
                           <FormField
                            control={form.control}
                            name={`examples.${language}.input`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                   <Input placeholder="Input" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={form.control}
                            name={`examples.${language}.output`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Output" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                       </div>
                       <FormField
                          control={form.control}
                          name={`examples.${language}.explanation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea placeholder="Explanation" {...field} />
                              </FormControl>
                               <FormMessage />
                            </FormItem>
                          )}
                       />
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
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full"
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