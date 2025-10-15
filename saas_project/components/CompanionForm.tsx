"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { subjects } from "@/constants"
import { Textarea } from "./ui/textarea"
import { createCompanion } from "@/lib/actions/companion.actions"
import { redirect } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(2, { message: "Companion is Required" }),
    subject: z.string().min(2, { message: "Subject is Required" }),
    topic: z.string().min(2, { message: "Topic is Required" }),
    voice: z.string().min(2, { message: "Voice is Required" }),
    style: z.string().min(2, { message: "Style is Required" }),
    duration: z.coerce.number().min(1, { message: "Duration is Required" }),
})

const CompanionForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        // zodResolver's inferred types can sometimes be incompatible with
        // react-hook-form's Resolver generic. Cast to the proper Resolver
        // to satisfy TypeScript.
        resolver: zodResolver(formSchema) as unknown as Resolver<z.infer<typeof formSchema>>,
        defaultValues: {
            name: " ",
            subject: " ",
            topic: " ",
            voice: " ",
            style: " ",
            duration: 15,
        },
    })

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        const companion = await createCompanion(values);
        if(companion){
            redirect(`/companions/${companion.id}`);
        }
        else{
            console.log("Error creating companion");
            redirect('/')
        }
    }
 
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Companion name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter the Companion Name" {...field} className="input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /><FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>subject</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} 
                                value={field.value} defaultValue={field.value}>
                                    <SelectTrigger className="input capitalize">
                                        <SelectValue placeholder="Select the Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            subjects.map((subject) => (
                                                <SelectItem key={subject} value={subject} className="capitalize">
                                                    {subject}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>What should the companion help with?</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter the topic" {...field} className="input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Voice</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} 
                                value={field.value} defaultValue={field.value}>
                                    <SelectTrigger className="input">
                                        <SelectValue placeholder="Select the Voice" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Style</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} 
                                value={field.value} defaultValue={field.value}>
                                    <SelectTrigger className="input">
                                        <SelectValue placeholder="Select the Style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="formal">
                                            Formal
                                        </SelectItem>
                                        <SelectItem value="casual">
                                            casual
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estimated session duration in minutes</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="15" {...field} className="input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full cursor-pointer">Build your companion</Button>
            </form>
        </Form>
    )

}


export default CompanionForm;