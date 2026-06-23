"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-form"; // Wait, react-hook-form
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
import { registerPlayer } from "@/lib/actions/register";

const playerSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 5 && Number(val) < 60, {
    message: "Age must be a valid number between 5 and 60.",
  }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  mobileNumber: z.string().min(10, { message: "Mobile number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  district: z.string().min(2, { message: "Please enter your district." }),
  position: z.string().min(1, { message: "Please select a position." }),
});

export default function PlayerRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      fullName: "",
      age: "",
      gender: "",
      mobileNumber: "",
      email: "",
      district: "",
      position: "",
    },
  });

  async function onSubmit(values: z.infer<typeof playerSchema>) {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    const result = await registerPlayer(values);
    
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
          <h1 className="text-3xl font-bold text-white">Player Registration</h1>
          <p className="text-blue-200 mt-2">Register to participate in upcoming PDHO tournaments and events.</p>
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
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="18" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input placeholder="Pune" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Playing Position</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                            <SelectItem value="Left Wing">Left Wing</SelectItem>
                            <SelectItem value="Left Back">Left Back</SelectItem>
                            <SelectItem value="Center Back">Center Back</SelectItem>
                            <SelectItem value="Right Back">Right Back</SelectItem>
                            <SelectItem value="Right Wing">Right Wing</SelectItem>
                            <SelectItem value="Pivot">Pivot</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
