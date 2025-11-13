import * as z from "zod";

export const RegisterFormSchema = z
  .object({
    name: z
      .string()
      .min(5, "Name of an user must be length of 5 at least.")
      .nonempty("Name is required"),
    email: z
      .string()
      .email("Please provide an valid email")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof RegisterFormSchema>;

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email("Please provide an valid email")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;
