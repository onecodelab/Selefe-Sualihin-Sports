import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, buttonVariants } from './ui/button';
import { cn } from '../lib/utils';
import { MenuToggleIcon } from './ui/menu-toggle-icon';
import { useScroll } from './ui/use-scroll';
import { createPortal } from 'react-dom';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const navigate = useNavigate();
	const { user, signOut, isAdmin } = useAuth();
	const { language, setLanguage, t } = useLanguage();

	const links = [
		{ label: t('nav.facilities'), href: '#facilities' },
		{ label: t('nav.pricing'), href: '#pricing' },
		{ label: t('nav.rules'), href: '#rules' },
		{ label: t('nav.contact'), href: '#contact' },
	];

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
			className={cn('fixed top-0 z-50 w-full border-b border-transparent transition-all', {
				'bg-white/80 backdrop-blur-lg border-gray-200/50 shadow-sm':
					scrolled || open,
			})}
		>
			<nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
				<div 
					className="cursor-pointer flex items-center gap-3 group"
					onClick={() => {
						navigate('/');
						setOpen(false);
					}}
				>
					<img src="/assets/logo.png" alt="Selefe Sualihin Sports" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
					<div className="flex flex-col">
						<span className="font-geist font-bold text-lg text-[#1d1d1f] leading-tight">Selefe Sualihin</span>
						<span className="font-geist font-medium text-[10px] tracking-[0.2em] uppercase text-[#0071e3] opacity-70">Sports Booking</span>
					</div>
				</div>

				<div className="hidden items-center gap-4 md:flex">
					{/* Language Toggle */}
					<button 
						onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
						className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] transition-all font-geist text-xs font-bold mr-2 border border-transparent"
					>
						<Globe size={14} />
						{language === 'en' ? 'አማርኛ' : 'English'}
					</button>

					{links.map((link) => (
						<a 
							key={link.label} 
							className={cn(buttonVariants({ variant: 'ghost' }), "font-geist text-sm font-medium text-[#1d1d1f] hover:text-[#0071e3]")} 
							href={link.href}
						>
							{link.label}
						</a>
					))}
					{user ? (
						<>
							{isAdmin && (
								<Button 
									className="rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs px-4"
									onClick={() => navigate('/admin')}
								>
									⚡ {t('nav.admin')}
								</Button>
							)}
							{isAdmin && (
								<Button 
									variant="outline" 
									className="rounded-full border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white"
									onClick={() => navigate('/dashboard')}
								>
									{t('nav.dashboard')}
								</Button>
							)}
							<Button 
								variant="ghost"
								className="text-[#1d1d1f]/60 hover:text-red-500"
								onClick={signOut}
							>
								{t('nav.signout')}
							</Button>
						</>
					) : (
						<>
							<Button 
								variant="outline" 
								className="rounded-full border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white"
								onClick={() => navigate('/login')}
							>
								{t('nav.signin')}
							</Button>
							<Button 
								className="rounded-full bg-[#121212] hover:bg-[#2a2a2a] text-white"
								onClick={() => navigate('/book')}
							>
								{t('nav.book')}
							</Button>
						</>
					)}
				</div>

				<div className="flex items-center gap-2 md:hidden">
					<button 
						onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
						className="p-2 rounded-lg bg-gray-50 text-gray-600 border border-gray-100"
					>
						<Globe size={18} />
					</button>
					<MenuToggleIcon open={open} onClick={() => setOpen(!open)} />
				</div>
			</nav>

			<AnimatePresence>
				{open &&
					createPortal(
						<motion.div 
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
							className="fixed inset-0 top-20 z-[60] bg-white px-6 py-10 md:hidden overflow-y-auto"
						>
							<div className="flex flex-col gap-6">
								{links.map((link) => (
									<a
										key={link.label}
										href={link.href}
										onClick={() => setOpen(false)}
										className="text-3xl font-geist font-black text-gray-900 tracking-tighter"
									>
										{link.label}
									</a>
								))}
								<div className="h-px bg-gray-100 my-4" />
								{user ? (
									<>
										{isAdmin && (
											<Button 
												className="w-full h-14 text-lg rounded-2xl bg-gray-900 text-white"
												onClick={() => {
													navigate('/admin');
													setOpen(false);
												}}
											>
												⚡ {t('nav.admin')}
											</Button>
										)}
										{isAdmin && (
											<Button 
												className="w-full h-14 text-lg rounded-2xl bg-[#0071e3] text-white"
												onClick={() => {
													navigate('/dashboard');
													setOpen(false);
												}}
											>
												{t('nav.dashboard')}
											</Button>
										)}
										<Button 
											variant="ghost"
											className="w-full text-gray-500"
											onClick={() => {
												signOut();
												setOpen(false);
											}}
										>
											{t('nav.signout')}
										</Button>
									</>
								) : (
									<div className="flex flex-col gap-4">
										<Button 
											className="w-full h-14 text-lg rounded-2xl bg-[#1d1d1f] text-white"
											onClick={() => {
												navigate('/book');
												setOpen(false);
											}}
										>
											{t('nav.book')}
										</Button>
										<Button 
											variant="outline"
											className="w-full h-14 text-lg rounded-2xl border-[#0071e3] text-[#0071e3]"
											onClick={() => {
												navigate('/login');
												setOpen(false);
											}}
										>
											{t('nav.signin')}
										</Button>
									</div>
								)}
							</div>
						</motion.div>,
						document.body
					)}
			</AnimatePresence>
		</header>
	);
}
