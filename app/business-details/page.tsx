'use client';

import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Please enter a valid email address"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province/Territory is required"),
  businessType: z.enum(["for-profit", "non-profit"]),
  industry: z.string().min(1, "Industry is required"),
  otherIndustry: z.string().optional(),
  businessStage: z.string().min(1, "Business stage is required"),
  startDate: z.string().min(1, "Start date is required"),
  gender: z.string().min(1, "Gender is required"),
  ageRange: z.string().min(1, "Age range is required"),
  underrepresentedGroups: z.array(z.string()).optional(),
  otherUnderrepresentedGroup: z.string().optional()
});

export default function BusinessDetailsPage() {
  const [showOtherField, setShowOtherField] = useState(false);
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "for-profit",
      underrepresentedGroups: [],
      otherUnderrepresentedGroup: "",
      otherIndustry: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/business-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save business details');
      }

      // Redirect to Stripe checkout
      window.location.href = result.redirectUrl;
    } catch (error) {
      console.error('Error:', error);
      // Here you might want to show an error message to the user
      // You could add a toast notification or error state to the form
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <img src="/images/logo.png" alt="Grant Pathway" className="h-8" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Tell Us About Your Business</h1>
            <p className="text-lg text-muted-foreground">
              Help us find the best grants for your business by providing some details.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Business Name and Location */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Business Details</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    {...form.register("businessName")}
                    id="businessName" 
                    placeholder="Enter your business name" 
                  />
                  {form.formState.errors.businessName && (
                    <p className="text-sm text-red-500">{form.formState.errors.businessName.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    {...form.register("email")}
                    id="email" 
                    type="email"
                    placeholder="Enter your email address" 
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    {...form.register("city")}
                    id="city" 
                    placeholder="City" 
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="province">Province/Territory</Label>
                  <Select onValueChange={(value) => form.setValue("province", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province/territory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="NB">New Brunswick</SelectItem>
                      <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                      <SelectItem value="NS">Nova Scotia</SelectItem>
                      <SelectItem value="NT">Northwest Territories</SelectItem>
                      <SelectItem value="NU">Nunavut</SelectItem>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="PE">Prince Edward Island</SelectItem>
                      <SelectItem value="QC">Quebec</SelectItem>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                      <SelectItem value="YT">Yukon</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.province && (
                    <p className="text-sm text-red-500">{form.formState.errors.province.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Type and Industry */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Business Type & Industry</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <RadioGroup 
                    defaultValue="for-profit" 
                    className="flex gap-4"
                    onValueChange={(value) => form.setValue("businessType", value as "for-profit" | "non-profit")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="for-profit" id="for-profit" />
                      <Label htmlFor="for-profit">For-Profit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-profit" id="non-profit" />
                      <Label htmlFor="non-profit">Non-Profit</Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.businessType && (
                    <p className="text-sm text-red-500">{form.formState.errors.businessType.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    onValueChange={(value) => {
                      form.setValue("industry", value);
                      setShowOtherIndustry(value === "other");
                      if (value !== "other") {
                        form.setValue("otherIndustry", "");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wellness">Health & Wellness</SelectItem>
                      <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="professional">Professional Services</SelectItem>
                      <SelectItem value="arts">Arts & Entertainment</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {showOtherIndustry && (
                    <div className="mt-2">
                      <Input 
                        {...form.register("otherIndustry")}
                        placeholder="Please specify your industry"
                      />
                      {form.formState.errors.otherIndustry && (
                        <p className="text-sm text-red-500">{form.formState.errors.otherIndustry.message}</p>
                      )}
                    </div>
                  )}
                  {form.formState.errors.industry && (
                    <p className="text-sm text-red-500">{form.formState.errors.industry.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Stage */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Business Stage</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Current Stage</Label>
                  <Select onValueChange={(value) => form.setValue("businessStage", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="established">Established</SelectItem>
                      <SelectItem value="expanding">Expanding</SelectItem>
                      <SelectItem value="pivoting">Pivoting/Transforming</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.businessStage && (
                    <p className="text-sm text-red-500">{form.formState.errors.businessStage.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Business Start Date</Label>
                  <Input 
                    type="date" 
                    id="startDate"
                    {...form.register("startDate")}
                  />
                  {form.formState.errors.startDate && (
                    <p className="text-sm text-red-500">{form.formState.errors.startDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Owner Demographics */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Owner Demographics</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <Select onValueChange={(value) => form.setValue("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.gender && (
                    <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Age Range</Label>
                  <Select onValueChange={(value) => form.setValue("ageRange", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-54">45-54</SelectItem>
                      <SelectItem value="55-64">55-64</SelectItem>
                      <SelectItem value="65+">65+</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.ageRange && (
                    <p className="text-sm text-red-500">{form.formState.errors.ageRange.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Underrepresented Groups (Optional)</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="indigenous" 
                        className="rounded border-gray-300"
                        {...form.register("underrepresentedGroups")}
                        value="indigenous"
                      />
                      <Label htmlFor="indigenous">Indigenous</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="visible-minority" 
                        className="rounded border-gray-300"
                        {...form.register("underrepresentedGroups")}
                        value="visible-minority"
                      />
                      <Label htmlFor="visible-minority">Visible Minority</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="newcomer" 
                        className="rounded border-gray-300"
                        {...form.register("underrepresentedGroups")}
                        value="newcomer"
                      />
                      <Label htmlFor="newcomer">Newcomer to Canada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="disability" 
                        className="rounded border-gray-300"
                        {...form.register("underrepresentedGroups")}
                        value="disability"
                      />
                      <Label htmlFor="disability">Person with Disability</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="veteran" 
                        className="rounded border-gray-300"
                        {...form.register("underrepresentedGroups")}
                        value="veteran"
                      />
                      <Label htmlFor="veteran">Veteran</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="other" 
                        className="rounded border-gray-300"
                        checked={showOtherField}
                        onChange={(e) => {
                          setShowOtherField(e.target.checked);
                          if (!e.target.checked) {
                            form.setValue("otherUnderrepresentedGroup", "");
                          }
                        }}
                      />
                      <Label htmlFor="other">Other</Label>
                    </div>
                    {showOtherField && (
                      <div className="ml-6">
                        <Input 
                          {...form.register("otherUnderrepresentedGroup")}
                          placeholder="Please specify"
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="lg" 
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                {form.formState.isSubmitting ? "Processing..." : "Continue to Payment"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 