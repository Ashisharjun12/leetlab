import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InterviewAPI } from '@/api/api';
import { toast } from 'sonner';
import { PlusCircle, Clock, Target, Briefcase, FileText, BarChart2, Calendar, Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UserInterviews from '@/pages/user/components/UserInterviews';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  jobPosition: z.string().min(2, "Job position must be at least 2 characters"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  interviewType: z.string().min(1, "Please select an interview type"),
  duration: z.string().min(1, "Please select a duration"),
  interviewDifficulty: z.string().min(1, "Please select a difficulty level"),
});

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPosition: "",
      jobDescription: "",
      interviewType: "",
      duration: "",
      interviewDifficulty: "",
    },
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await InterviewAPI.getuserInterviews();
      if (response.data.success) {
        console.log("inteviesuser da",response.data)
        setInterviews(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  const interviewTypes = [
    { value: 'Technical Interview', icon: <Target className="w-4 h-4" /> },
    { value: 'Behavioral Interview', icon: <BarChart2 className="w-4 h-4" /> },
    { value: 'System Design Interview', icon: <FileText className="w-4 h-4" /> },
    { value: 'Problem Solving Interview', icon: <Target className="w-4 h-4" /> },
    { value: 'Leadership Interview', icon: <BarChart2 className="w-4 h-4" /> }
  ];

  const durations = [
    { value: '2 min', label: '2 minutes' },
    { value: '5 min', label: '5 minutes' },
    { value: '10 min', label: '10 minutes' },
    { value: '15 min', label: '15 minutes' },
    { value: '30 min', label: '30 minutes' },
    { value: '45 min', label: '45 minutes' },
    { value: '1 hr', label: '1 hour' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-500' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    { value: 'hard', label: 'Hard', color: 'text-red-500' }
  ];

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setIsDialogOpen(false);
      const response = await InterviewAPI.createInterview(data);
      if (response.data.success) {
        toast.success('Interview created successfully');
        form.reset();
        fetchInterviews();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interviews</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Create New Interview</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                <FormField
                  control={form.control}
                  name="jobPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Job Position
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Node.js Backend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Job Description
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter job description" 
                          className="resize-none" 
                          rows={3} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="interviewType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Interview Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {interviewTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="flex items-center gap-2">
                                {type.icon}
                                {type.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Duration
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration.value} value={duration.value}>
                                {duration.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="interviewDifficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" />
                        Difficulty
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficulties.map((difficulty) => (
                            <SelectItem 
                              key={difficulty.value} 
                              value={difficulty.value}
                              className={difficulty.color}
                            >
                              {difficulty.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Interview...
                    </div>
                  ) : (
                    'Create Interview'
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isSubmitting && (
        <Alert className="mb-6 bg-primary/10 border-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Generating Your Interview</AlertTitle>
          <AlertDescription>
            Please wait while we generate your interview questions. This may take a few moments.
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <UserInterviews interviews={interviews} />
      )}
    </div>
  );
};

export default Interview;