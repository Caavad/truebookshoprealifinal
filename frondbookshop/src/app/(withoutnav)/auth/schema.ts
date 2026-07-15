import { z } from 'zod'

export const passwordSchema = z.string().min(6, { message: 'Insert correcr password' })

export const formLoginSchema = z.object({
    email: z.string().email({ message: 'Insert correct gmail' }),
    password: passwordSchema,
    loginAs: z.enum(['user', 'translator']).default('user')
})

export const formRegisterSchema = formLoginSchema.merge(
    z.object({
        fullName: z.string().min(2, { message: 'Insert Name and Surname' }),
        confirmPassword: passwordSchema,
        role: z.enum(['Customer', 'Author']).default('Customer')
    })
).refine(data => data.password === data.confirmPassword, {
    message: 'Password incorrect',
    path: ['confirmPassword']
})

export type TFormLoginValues = z.infer<typeof formLoginSchema>
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>