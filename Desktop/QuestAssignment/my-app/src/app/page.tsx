"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  userName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  userBio: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function Home() {

  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      userBio: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setErrorMessage("");
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        console.log("Form data submitted successfully")
        var data = await response.json()
        console.log(data)

        if(data['error'] = 1){
          setErrorMessage(data.msg)
        }
        form.setValue("userName", data.nameAI)
        form.setValue("userBio", data.bioAI)
      } else {
        console.error("Failed to submit form data")
        setErrorMessage( "Failed to submit form data")
      }
    } catch (error) {
      console.error("Error occurred while submitting form data:", error)

      setErrorMessage("Error occurred while submitting form data: " + error);

    }
  }

  const resetForm = () => {
    setErrorMessage("");
    form.reset({
      userName: "",
      userBio: ""
    });
   
    console.log("Form data cleared");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display userName.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display Bio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={resetForm}>Reset</Button>
        </div>

        {errorMessage && (
          <div className="text-red-600 mt-2">
            {errorMessage}
          </div>
        )}
      </form>
    </Form>
  )
}
