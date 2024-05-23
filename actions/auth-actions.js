'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createAuthSession, destroyAuthSession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";

export async function signup(prevState, formData) {

    const email = formData.get('email');
    const password = formData.get('password');

    let errors = {}

    if (!email.includes('@')) {
        errors.email = "Please enter a valid email address."
    }

    if (password.trim().length < 8) {
        errors.password = "Password must be at least 8 characters long."
    }

    if (Object.keys(errors).length > 0) {
        return {
            errors
        }
    }

    // hashing a password
    const hashedPassword = hashUserPassword(password);

    // store it in the database
    try {
        const id = createUser(email, hashedPassword);

        await createAuthSession(id);
        redirect('/training');

    } catch (error) {

        // handle unique field value
        if (error.code === "SQLITE_CONTRAINT_UNIQUE") {
            return {
                errors: {
                    email: "It seems like an account for the chosen email already exists."
                }
            }
        }

        // below will be handle by nearest error.js file
        throw error;
        throw new Error(error.message);
    }

}

export async function login(prevState, formData) {

    const email = formData.get('email');
    const password = formData.get('password');


    const existingUser = getUserByEmail(email);

    if (!existingUser) {
        return {
            errors: {
                email: "Could not authenticate user, please check your credentials."
            }
        }
    }

    const isValidPassword = verifyPassword(existingUser.password, password)

    if (!isValidPassword) {
        return {
            errors: {
                password: "Could not authenticate user, please check your credentials."
            }
        }
    }

    // await createAuthSession(existingUser.id);
    redirect('/training');
}

export async function auth(mode, prevState, formData) {

    console.log(mode);

    if (mode === 'login') {
        return login(prevState, formData)
    }

    return signup(prevState, formData)
}

export async function logout() {
    await destroyAuthSession();
    redirect('/');
}