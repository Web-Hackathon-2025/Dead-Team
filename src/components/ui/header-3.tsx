'use client';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LucideIcon } from 'lucide-react';
import {
	Wrench,
	Zap,
	GraduationCap,
	Sparkles,
	Wind,
	Car,
	Users,
	Star,
	FileText,
	Shield,
	RotateCcw,
	Handshake,
	Leaf,
	HelpCircle,
	BarChart,
	PlugIcon,
} from 'lucide-react';

type LinkItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
};

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
				'bg-white/95 supports-[backdrop-filter]:bg-white/50 border-gray-200 backdrop-blur-lg':
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-5">
					<a href="/" className="hover:bg-gray-100 rounded-md p-2">
						<span className="text-2xl font-bold text-gray-900">Karigar</span>
					</a>
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink className="px-4" asChild>
									<a href="/" className="hover:bg-primary/10 hover:text-primary rounded-md p-2 text-gray-700 font-medium transition-colors">
										Home
									</a>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-gray-700 hover:bg-primary/10 hover:text-primary">Services</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-white p-1 pr-1.5">
									<ul className="bg-white grid w-lg grid-cols-2 gap-2 rounded-md border border-gray-200 p-2 shadow-lg">
										{serviceLinks.map((item, i) => (
											<li key={i}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink className="px-4" asChild>
									<a href="/contact" className="hover:bg-primary/10 hover:text-primary rounded-md p-2 text-gray-700 font-medium transition-colors">
										Contact
									</a>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Link to="/login">
						<Button variant="outline">Login</Button>
					</Link>
					<Link to="/signup">
						<Button>Sign Up</Button>
					</Link>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
				<NavigationMenu className="max-w-full">
					<div className="flex w-full flex-col gap-y-2">
						<a href="/" className="text-sm font-medium text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md px-2 py-2 transition-colors">Home</a>
						<span className="text-sm font-medium text-gray-700 px-2 py-1">Services</span>
						{serviceLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						<a href="/contact" className="text-sm font-medium text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md px-2 py-2 transition-colors">Contact</a>
					</div>
				</NavigationMenu>
				<div className="flex flex-col gap-2">
					<Link to="/login">
						<Button variant="outline" className="w-full bg-transparent">
							Login
						</Button>
					</Link>
					<Link to="/signup">
						<Button className="w-full">Sign Up</Button>
					</Link>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-white/95 supports-[backdrop-filter]:bg-white/50 backdrop-blur-lg',
				'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-gray-200 md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
					'size-full p-4',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function ListItem({
	title,
	description,
	icon: Icon,
	className,
	href,
	...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
	return (
		<NavigationMenuLink className={cn('w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-primary/10 data-[active=true]:hover:bg-primary/10 data-[active=true]:bg-primary/5 data-[active=true]:text-primary hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary rounded-sm p-2 transition-colors', className)} {...props} asChild>
			<a href={href}>
				<div className="bg-gray-50 flex aspect-square size-12 items-center justify-center rounded-md border border-gray-200 shadow-sm">
					<Icon className="text-gray-900 size-5" />
				</div>
				<div className="flex flex-col items-start justify-center">
					<span className="font-medium text-gray-900">{title}</span>
					{description && <span className="text-gray-600 text-xs">{description}</span>}
				</div>
			</a>
		</NavigationMenuLink>
	);
}

const serviceLinks: LinkItem[] = [
	{
		title: 'Plumber',
		href: '/services/plumber',
		description: 'Expert plumbing services',
		icon: Wrench,
	},
	{
		title: 'Electrician',
		href: '/services/electrician',
		description: 'Professional electrical work',
		icon: Zap,
	},
	{
		title: 'Tutor',
		href: '/services/tutor',
		description: 'Personalized learning',
		icon: GraduationCap,
	},
	{
		title: 'Cleaner',
		href: '/services/cleaner',
		description: 'Spotless cleaning services',
		icon: Sparkles,
	},
	{
		title: 'AC Technician',
		href: '/services/ac-technician',
		description: 'Cooling solutions',
		icon: Wind,
	},
	{
		title: 'Mechanic',
		href: '/services/mechanic',
		description: 'Auto repair & maintenance',
		icon: Car,
	},
];

function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > threshold);
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	// also check on first load
	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}

