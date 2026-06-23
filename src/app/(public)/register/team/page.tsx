"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerTeam } from "@/lib/actions/register";

const teamSchema = z.object({
  name: z.string().min(2, { message: "Team name must be at least 2 characters." }),
  managerName: z.string().min(2, { message: "Manager name must be at least 2 characters." }),
  contactNumber: z.string().min(10, { message: "Contact number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  category: z.string().min(1, { message: "Please select a category." }),
});

export default function TeamRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      managerName: "",
      contactNumber: "",
      email: "",
      category: "",
    },
  });

  async function onSubmit(values: z.infer<typeof teamSchema>) {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    const result = await registerTeam(values);
    
    if (result.success) {
      setSuccessMessage(result.message);
      form.reset();
    } else {
      setErrorMessage(result.message);
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-blue-950 py-12 border-b">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold text-white">Team Registration</h1>
          <p className="text-blue-200 mt-2">Register your team for the upcoming PDHO tournaments.</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 font-medium">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 font-medium">
                {errorMessage}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Pune Panthers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="managerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="U-14 Boys">U-14 Boys</SelectItem>
                          <SelectItem value="U-14 Girls">U-14 Girls</SelectItem>
                          <SelectItem value="U-17 Boys">U-17 Boys</SelectItem>
                          <SelectItem value="U-17 Girls">U-17 Girls</SelectItem>
                          <SelectItem value="Senior Men">Senior Men</SelectItem>
                          <SelectItem value="Senior Women">Senior Women</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Team Registration"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
