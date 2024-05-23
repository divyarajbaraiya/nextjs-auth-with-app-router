import { logout } from '@/actions/auth-actions';

import '../globals.css'; // need to go one level up due to route group as it will not visible on path but still a physical folder

export const metadata = {
    title: 'Next Auth',
    description: 'Next.js Authentication',
};

// export default function AuthLayout({ children }) {
export default function AuthRootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <header id='auth-header'>
                    <p>Welcome Back!</p>

                    <form action={logout}>
                        <button>Logout</button>
                    </form>
                </header>

                {children}
            </body>
        </html>
    );
}