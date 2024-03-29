import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import cn from '@/lib/cn'
import Container from '@/components/Container'
import Sidebar from '@/components/Sidebar'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'sonner'
import GroupCommand from '@/components/GroupCommand'
import { GroupProvider } from '@/context/GroupContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Quest',
	description: 'quest is a task',
	icons: "/logo.png"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={cn(inter.className, "flex overflow-hidden h-screen")}>
				<Toaster expand={true} position='top-center' richColors={true} />
				<AuthProvider>
					<GroupProvider>
						<GroupCommand />
						<Container className="h-screen w-screen overflow-hidden">
							<Sidebar />
							{children}
						</Container>
					</GroupProvider>
				</AuthProvider>
			</body>
		</html >
	)
}
