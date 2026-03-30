"use client";
import jsPDF from "jspdf";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
	FaHeart,
	FaHandHoldingHeart,
	FaTrophy,
	FaMedal,
	FaFireAlt,
	FaCalendarAlt,
	FaFilter,
	FaChartLine,
	FaSearch,
	FaStar,
	FaCrown,
	FaBars,
	FaTimes,
	FaChevronDown,
	FaChevronUp,
	FaDownload,
	FaInfoCircle,
	FaCheckCircle,
	FaLock,
	FaUsers,
	FaQuestion,
	FaSignOutAlt,
} from "react-icons/fa";
import { FiChevronsUp } from "react-icons/fi";
import {
	BsFillCalendarHeartFill,
	BsGraphUp,
	BsLightningChargeFill,
} from "react-icons/bs";
import { IoMdHeart } from "react-icons/io";
import { RiUserHeartFill } from "react-icons/ri";

interface Donor {
	id: number;
	name: string;
	avatar: string;
	amount: number;
	totalDonated: number;
	date: Date;
	type: "one-time" | "recurring" | "monthly" | "annual";
	cause: string;
	achievements: Achievement[];
	level: number;
}

interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	unlockedAt: number;
	isUnlocked: boolean;
	color: string;
}

interface DonationDay {
	date: string;
	count: number;
	amount: number;
}

const getRandomAvatar = (seed: number) => {
	return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
};

const generateDummyData = (): Donor[] => {
	const causes = [
		"Ocean Cleanup",
		"Rainforest Preservation",
		"Children's Education",
		"Animal Welfare",
		"Local Food Bank",
		"Climate Action",
		"Medical Research",
		"Digital Literacy",
	];

	const names = [
		"Alex Morgan",
		"Taylor Swift",
		"Jordan Chen",
		"Morgan Freeman",
		"Casey Johnson",
		"Riley Smith",
		"Quinn Davis",
		"Jamie Wilson",
		"Avery Thomas",
		"Drew Martin",
		"Skyler Brown",
		"Cameron White",
		"Hayden Miller",
		"Reese Garcia",
		"Devon Rodriguez",
		"Finley Moore",
		"Sydney Jackson",
		"Blake Thompson",
		"Dakota Clark",
		"Charlie Lee",
	];

	const donationTypes: ("one-time" | "recurring" | "monthly" | "annual")[] = [
		"one-time",
		"recurring",
		"monthly",
		"annual",
	];

	const achievements: Achievement[] = [
		{
			id: "first-donation",
			title: "First Steps",
			description: "Made your first donation",
			icon: "heart",
			unlockedAt: 1,
			isUnlocked: false,
			color: "#0ea5e9",
		},
		{
			id: "five-donations",
			title: "Regular Giver",
			description: "Made 5 donations",
			icon: "medal",
			unlockedAt: 5,
			isUnlocked: false,
			color: "#10b981",
		},
		{
			id: "ten-donations",
			title: "Committed Supporter",
			description: "Made 10 donations",
			icon: "trophy",
			unlockedAt: 10,
			isUnlocked: false,
			color: "#f97316",
		},
		{
			id: "twenty-donations",
			title: "Philanthropist",
			description: "Made 20 donations",
			icon: "crown",
			unlockedAt: 20,
			isUnlocked: false,
			color: "#8b5cf6",
		},
		{
			id: "hundred-dollars",
			title: "Century Club",
			description: "Donated $100 in total",
			icon: "fire",
			unlockedAt: 100,
			isUnlocked: false,
			color: "#ec4899",
		},
		{
			id: "five-hundred-dollars",
			title: "Silver Benefactor",
			description: "Donated $500 in total",
			icon: "star",
			unlockedAt: 500,
			isUnlocked: false,
			color: "#6366f1",
		},
		{
			id: "thousand-dollars",
			title: "Gold Patron",
			description: "Donated $1,000 in total",
			icon: "gem",
			unlockedAt: 1000,
			isUnlocked: false,
			color: "#eab308",
		},
	];

	const donors: Donor[] = [];

	for (let i = 1; i <= 30; i++) {
		const randomNameIndex = Math.floor(Math.random() * names.length);
		const name = names[randomNameIndex];

		const randomCauseIndex = Math.floor(Math.random() * causes.length);
		const cause = causes[randomCauseIndex];

		const donationCount = Math.floor(Math.random() * 25) + 1;
		const totalDonated = Math.floor(Math.random() * 2000) + 10;
		const level = Math.floor(totalDonated / 100) + 1;

		const randomTypeIndex = Math.floor(Math.random() * donationTypes.length);
		const type = donationTypes[randomTypeIndex];

		const recentAmount = Math.floor(Math.random() * 200) + 10;

		const dayOffset = Math.floor(Math.random() * 30);
		const date = new Date();
		date.setDate(date.getDate() - dayOffset);

		const userAchievements = achievements.map((achievement) => {
			let isUnlocked;

			if (achievement.id.includes("dollars")) {
				isUnlocked = totalDonated >= achievement.unlockedAt;
			} else {
				isUnlocked = donationCount >= achievement.unlockedAt;
			}

			return {
				...achievement,
				isUnlocked,
			};
		});

		donors.push({
			id: i,
			name,
			avatar: getRandomAvatar(i),
			amount: recentAmount,
			totalDonated,
			date,
			type,
			cause,
			achievements: userAchievements,
			level,
		});
	}

	return donors.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const generateHeatmapData = (): DonationDay[] => {
	const data: DonationDay[] = [];
	const today = new Date();

	for (let i = 365; i >= 0; i--) {
		const date = new Date();
		date.setDate(today.getDate() - i);
		const dateStr = date.toISOString().split("T")[0];

		const isWeekend = date.getDay() === 0 || date.getDay() === 6;
		const isPayday = date.getDate() === 15 || date.getDate() === 30;

		let baseCount = Math.floor(Math.random() * 3);
		if (isWeekend) baseCount += 2;
		if (isPayday) baseCount += 3;

		if (Math.random() > 0.95) baseCount += 8;

		const count = baseCount;
		const amount = count * (Math.floor(Math.random() * 50) + 20);

		data.push({ date: dateStr, count, amount });
	}

	return data;
};

function DonorList() {
	const [donors, setDonors] = useState<Donor[]>([]);
	const [heatmapData, setHeatmapData] = useState<DonationDay[]>([]);
	const [filters, setFilters] = useState({
		type: "all",
		amountRange: "all",
		cause: "all",
		search: "",
	});
	const [newDonationAmount, setNewDonationAmount] = useState<number>(25);
	const [donationFrequency, setDonationFrequency] = useState<
		"one-time" | "monthly" | "annual"
	>("one-time");
	const [selectedCause, setSelectedCause] = useState<string>("Ocean Cleanup");
	const [showAchievementModal, setShowAchievementModal] =
		useState<boolean>(false);
	const [newAchievement, setNewAchievement] = useState<Achievement | null>(
		null
	);
	const [activeSection, setActiveSection] = useState<string>("dashboard");
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<Donor | null>(null);
	const [showNewDonationModal, setShowNewDonationModal] =
		useState<boolean>(false);
	const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
		null
	);
	const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth());
	const [activeYear, setActiveYear] = useState<number>(
		new Date().getFullYear()
	);
	const [monthlyStats, setMonthlyStats] = useState({
		totalDonated: 0,
		donorCount: 0,
		averageDonation: 0,
	});
	const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
	const profileRef = useRef<HTMLDivElement>(null);
	const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
	const [paymentStep, setPaymentStep] = useState<
		"details" | "payment" | "review" | "processing"
	>("details");
	const [cardDetails, setCardDetails] = useState({
		number: "",
		name: "",
		expiry: "",
		cvv: "",
	});
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<string>("new-card");
	const [isProcessing, setIsProcessing] = useState(false);
	const [processingProgress, setProcessingProgress] = useState(0);
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const [receiptId, setReceiptId] = useState("");

	useEffect(() => {
		const donorsData = generateDummyData();
		setDonors(donorsData);
		setHeatmapData(generateHeatmapData());

		setCurrentUser(donorsData[0]);

		calculateMonthlyStats(
			new Date().getMonth(),
			new Date().getFullYear(),
			donorsData
		);

		const isFirstVisit = !localStorage.getItem("donorHubVisited");
		if (isFirstVisit) {
			localStorage.setItem("donorHubVisited", "true");
		}
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				profileRef.current &&
				!profileRef.current.contains(e.target as Node)
			) {
				setShowProfileModal(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const calculateMonthlyStats = (
		month: number,
		year: number,
		donorsList: Donor[]
	) => {
		const monthDonations = donorsList.filter((donor) => {
			const donationDate = new Date(donor.date);
			return (
				donationDate.getMonth() === month && donationDate.getFullYear() === year
			);
		});

		const totalDonated = monthDonations.reduce(
			(sum, donor) => sum + donor.amount,
			0
		);
		const donorCount = monthDonations.length;
		const averageDonation =
			donorCount > 0 ? Math.round(totalDonated / donorCount) : 0;

		setMonthlyStats({
			totalDonated,
			donorCount,
			averageDonation,
		});
	};

	const filteredDonors = useMemo(() => {
		return donors.filter((donor) => {
			if (filters.type !== "all" && donor.type !== filters.type) {
				return false;
			}

			if (filters.amountRange !== "all") {
				const [min, max] = filters.amountRange.split("-").map(Number);
				if (max && (donor.amount < min || donor.amount > max)) {
					return false;
				} else if (!max && donor.amount < min) {
					return false;
				}
			}

			if (filters.cause !== "all" && donor.cause !== filters.cause) {
				return false;
			}

			if (
				filters.search &&
				!donor.name.toLowerCase().includes(filters.search.toLowerCase())
			) {
				return false;
			}

			return true;
		});
	}, [donors, filters]);

	const topDonors = useMemo(() => {
		return [...donors]
			.sort((a, b) => b.totalDonated - a.totalDonated)
			.slice(0, 5);
	}, [donors]);

	const causes = useMemo(() => {
		return Array.from(new Set(donors.map((donor) => donor.cause)));
	}, [donors]);

	const formatCardNumber = (value: string) => {
		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
		const matches = v.match(/\d{4,16}/g);
		const match = (matches && matches[0]) || "";
		const parts = [];
		for (let i = 0, len = match.length; i < len; i += 4) {
			parts.push(match.substring(i, i + 4));
		}
		return parts.length ? parts.join(" ") : v;
	};

	const formatExpiry = (value: string) => {
		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
		if (v.length >= 2) {
			return v.substring(0, 2) + "/" + v.substring(2, 4);
		}
		return v;
	};

	const resetPaymentFlow = () => {
		setPaymentStep("details");
		setCardDetails({ number: "", name: "", expiry: "", cvv: "" });
		setSelectedPaymentMethod("new-card");
		setIsProcessing(false);
		setProcessingProgress(0);
		setPaymentSuccess(false);
		setReceiptId("");
	};

	const closePaymentModal = () => {
		setShowNewDonationModal(false);
		resetPaymentFlow();
	};

	const startProcessing = () => {
		if (!currentUser) return;
		setPaymentStep("processing");
		setIsProcessing(true);
		setProcessingProgress(0);

		const generated = "DH-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
		setReceiptId(generated);

		let progress = 0;
		const interval = setInterval(() => {
			progress += Math.random() * 15 + 5;
			if (progress >= 100) {
				progress = 100;
				clearInterval(interval);
				setTimeout(() => {
					setIsProcessing(false);
					setPaymentSuccess(true);

					const updatedUser = { ...currentUser };
					updatedUser.totalDonated += newDonationAmount;
					const newLevel = Math.floor(updatedUser.totalDonated / 100) + 1;
					const leveledUp = newLevel > updatedUser.level;
					updatedUser.level = newLevel;

					let newlyUnlockedAchievement: Achievement | null = null;
					const updatedAchievements = updatedUser.achievements.map(
						(achievement) => {
							if (achievement.isUnlocked) return achievement;
							let isNowUnlocked = false;
							if (achievement.id.includes("dollars")) {
								isNowUnlocked =
									updatedUser.totalDonated >= achievement.unlockedAt;
							} else {
								isNowUnlocked =
									updatedUser.achievements.filter((a) => a.isUnlocked)
										.length +
										1 >=
									achievement.unlockedAt;
							}
							if (isNowUnlocked && !newlyUnlockedAchievement) {
								newlyUnlockedAchievement = {
									...achievement,
									isUnlocked: true,
								};
							}
							return {
								...achievement,
								isUnlocked: achievement.isUnlocked || isNowUnlocked,
							};
						}
					);

					updatedUser.achievements = updatedAchievements;
					setCurrentUser(updatedUser);

					const updatedDonors = donors.map((donor) =>
						donor.id === currentUser.id ? updatedUser : donor
					);
					setDonors(updatedDonors);

					if (newlyUnlockedAchievement) {
						setNewAchievement(newlyUnlockedAchievement);
						setShowAchievementModal(true);
					}

					if (leveledUp) {
						setTimeout(() => {
							setConfirmationMessage(
								`Congratulations! You've reached Level ${newLevel}!`
							);
							setTimeout(() => setConfirmationMessage(null), 4000);
						}, 2000);
					}

					calculateMonthlyStats(
						new Date().getMonth(),
						new Date().getFullYear(),
						updatedDonors
					);
				}, 500);
			}
			setProcessingProgress(Math.min(progress, 100));
		}, 200);
	};

	const getPaymentMethodLabel = () => {
		if (selectedPaymentMethod === "saved-visa") return "Visa •••• 4242";
		if (selectedPaymentMethod === "paypal") return "PayPal";
		if (selectedPaymentMethod === "apple-pay") return "Apple Pay";
		if (selectedPaymentMethod === "new-card" && cardDetails.number) {
			return `Card •••• ${cardDetails.number.replace(/\s/g, "").slice(-4)}`;
		}
		return "Credit/Debit Card";
	};

	const changeMonth = (offset: number) => {
		let newMonth = activeMonth + offset;
		let newYear = activeYear;

		if (newMonth > 11) {
			newMonth = 0;
			newYear += 1;
		} else if (newMonth < 0) {
			newMonth = 11;
			newYear -= 1;
		}

		setActiveMonth(newMonth);
		setActiveYear(newYear);
		calculateMonthlyStats(newMonth, newYear, donors);
	};

	const formatDate = (date: Date): string => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date);
	};

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getMonthName = (month: number): string => {
		const date = new Date();
		date.setMonth(month);
		return date.toLocaleString("default", { month: "long" });
	};

	return (
		<div className="min-h-screen bg-neutral-50 font-poppins text-neutral-800">
			<style>
				{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          * {
            font-family: 'Poppins', sans-serif;
          }
           
    @import 'https://cdn.tailwindcss.com';

   :root {
            
            --primary-50: #f0f9ff;
            --primary-100: #e0f2fe;
            --primary-200: #bae6fd;
            --primary-300: #7dd3fc;
            --primary-400: #38bdf8;
            --primary-500: #0ea5e9;
            --primary-600: #0284c7;
            --primary-700: #0369a1;
            --primary-800: #075985;
            --primary-900: #0c4a6e;
            
            
            --secondary-50: #ecfdf5;
            --secondary-100: #d1fae5;
            --secondary-200: #a7f3d0;
            --secondary-300: #6ee7b7;
            --secondary-400: #34d399;
            --secondary-500: #10b981;
            --secondary-600: #059669;
            --secondary-700: #047857;
            --secondary-800: #065f46;
            --secondary-900: #064e3b;
            
            
            --neutral-50: #f8fafc;
            --neutral-100: #f1f5f9;
            --neutral-200: #e2e8f0;
            --neutral-300: #cbd5e1;
            --neutral-400: #94a3b8;
            --neutral-500: #64748b;
            --neutral-600: #475569;
            --neutral-700: #334155;
            --neutral-800: #1e293b;
            --neutral-900: #0f172a;
            
            
            --accent-50: #fff7ed;
            --accent-100: #ffedd5;
            --accent-200: #fed7aa;
            --accent-300: #fdba74;
            --accent-400: #fb923c;
            --accent-500: #f97316;
            --accent-600: #ea580c;
            --accent-700: #c2410c;
            --accent-800: #9a3412;
            --accent-900: #7c2d12;
        }

        
        .bg-primary-50 { background-color: var(--primary-50); }
        .bg-primary-100 { background-color: var(--primary-100); }
        .bg-primary-200 { background-color: var(--primary-200); }
        .bg-primary-300 { background-color: var(--primary-300); }
        .bg-primary-400 { background-color: var(--primary-400); }
        .bg-primary-500 { background-color: var(--primary-500); }
        .bg-primary-600 { background-color: var(--primary-600); }
        .bg-primary-700 { background-color: var(--primary-700); }
        .bg-primary-800 { background-color: var(--primary-800); }
        .bg-primary-900 { background-color: var(--primary-900); }
        
        .text-primary-50 { color: var(--primary-50); }
        .text-primary-100 { color: var(--primary-100); }
        .text-primary-200 { color: var(--primary-200); }
        .text-primary-300 { color: var(--primary-300); }
        .text-primary-400 { color: var(--primary-400); }
        .text-primary-500 { color: var(--primary-500); }
        .text-primary-600 { color: var(--primary-600); }
        .text-primary-700 { color: var(--primary-700); }
        .text-primary-800 { color: var(--primary-800); }
        .text-primary-900 { color: var(--primary-900); }

        .border-primary-50 { border-color: var(--primary-50); }
        .border-primary-100 { border-color: var(--primary-100); }
        .border-primary-200 { border-color: var(--primary-200); }
        .border-primary-300 { border-color: var(--primary-300); }
        .border-primary-400 { border-color: var(--primary-400); }
        .border-primary-500 { border-color: var(--primary-500); }
        .border-primary-600 { border-color: var(--primary-600); }
        .border-primary-700 { border-color: var(--primary-700); }
        .border-primary-800 { border-color: var(--primary-800); }
        .border-primary-900 { border-color: var(--primary-900); }

        
        .bg-secondary-50 { background-color: var(--secondary-50); }
        .bg-secondary-100 { background-color: var(--secondary-100); }
        .bg-secondary-200 { background-color: var(--secondary-200); }
        .bg-secondary-300 { background-color: var(--secondary-300); }
        .bg-secondary-400 { background-color: var(--secondary-400); }
        .bg-secondary-500 { background-color: var(--secondary-500); }
        .bg-secondary-600 { background-color: var(--secondary-600); }
        .bg-secondary-700 { background-color: var(--secondary-700); }
        .bg-secondary-800 { background-color: var(--secondary-800); }
        .bg-secondary-900 { background-color: var(--secondary-900); }
        
        .text-secondary-50 { color: var(--secondary-50); }
        .text-secondary-100 { color: var(--secondary-100); }
        .text-secondary-200 { color: var(--secondary-200); }
        .text-secondary-300 { color: var(--secondary-300); }
        .text-secondary-400 { color: var(--secondary-400); }
        .text-secondary-500 { color: var(--secondary-500); }
        .text-secondary-600 { color: var(--secondary-600); }
        .text-secondary-700 { color: var(--secondary-700); }
        .text-secondary-800 { color: var(--secondary-800); }
        .text-secondary-900 { color: var(--secondary-900); }

        .border-secondary-50 { border-color: var(--secondary-50); }
        .border-secondary-100 { border-color: var(--secondary-100); }
        .border-secondary-200 { border-color: var(--secondary-200); }
        .border-secondary-300 { border-color: var(--secondary-300); }
        .border-secondary-400 { border-color: var(--secondary-400); }
        .border-secondary-500 { border-color: var(--secondary-500); }
        .border-secondary-600 { border-color: var(--secondary-600); }
        .border-secondary-700 { border-color: var(--secondary-700); }
        .border-secondary-800 { border-color: var(--secondary-800); }
        .border-secondary-900 { border-color: var(--secondary-900); }

        
        .bg-neutral-50 { background-color: var(--neutral-50); }
        .bg-neutral-100 { background-color: var(--neutral-100); }
        .bg-neutral-200 { background-color: var(--neutral-200); }
        .bg-neutral-300 { background-color: var(--neutral-300); }
        .bg-neutral-400 { background-color: var(--neutral-400); }
        .bg-neutral-500 { background-color: var(--neutral-500); }
        .bg-neutral-600 { background-color: var(--neutral-600); }
        .bg-neutral-700 { background-color: var(--neutral-700); }
        .bg-neutral-800 { background-color: var(--neutral-800); }
        .bg-neutral-900 { background-color: var(--neutral-900); }
        
        .text-neutral-50 { color: var(--neutral-50); }
        .text-neutral-100 { color: var(--neutral-100); }
        .text-neutral-200 { color: var(--neutral-200); }
        .text-neutral-300 { color: var(--neutral-300); }
        .text-neutral-400 { color: var(--neutral-400); }
        .text-neutral-500 { color: var(--neutral-500); }
        .text-neutral-600 { color: var(--neutral-600); }
        .text-neutral-700 { color: var(--neutral-700); }
        .text-neutral-800 { color: var(--neutral-800); }
        .text-neutral-900 { color: var(--neutral-900); }

        .border-neutral-50 { border-color: var(--neutral-50); }
        .border-neutral-100 { border-color: var(--neutral-100); }
        .border-neutral-200 { border-color: var(--neutral-200); }
        .border-neutral-300 { border-color: var(--neutral-300); }
        .border-neutral-400 { border-color: var(--neutral-400); }
        .border-neutral-500 { border-color: var(--neutral-500); }
        .border-neutral-600 { border-color: var(--neutral-600); }
        .border-neutral-700 { border-color: var(--neutral-700); }
        .border-neutral-800 { border-color: var(--neutral-800); }
        .border-neutral-900 { border-color: var(--neutral-900); }

        
        .bg-accent-50 { background-color: var(--accent-50); }
        .bg-accent-100 { background-color: var(--accent-100); }
        .bg-accent-200 { background-color: var(--accent-200); }
        .bg-accent-300 { background-color: var(--accent-300); }
        .bg-accent-400 { background-color: var(--accent-400); }
        .bg-accent-500 { background-color: var(--accent-500); }
        .bg-accent-600 { background-color: var(--accent-600); }
        .bg-accent-700 { background-color: var(--accent-700); }
        .bg-accent-800 { background-color: var(--accent-800); }
        .bg-accent-900 { background-color: var(--accent-900); }
        
        .text-accent-50 { color: var(--accent-50); }
        .text-accent-100 { color: var(--accent-100); }
        .text-accent-200 { color: var(--accent-200); }
        .text-accent-300 { color: var(--accent-300); }
        .text-accent-400 { color: var(--accent-400); }
        .text-accent-500 { color: var(--accent-500); }
        .text-accent-600 { color: var(--accent-600); }
        .text-accent-700 { color: var(--accent-700); }
        .text-accent-800 { color: var(--accent-800); }
        .text-accent-900 { color: var(--accent-900); }

        .border-accent-50 { border-color: var(--accent-50); }
        .border-accent-100 { border-color: var(--accent-100); }
        .border-accent-200 { border-color: var(--accent-200); }
        .border-accent-300 { border-color: var(--accent-300); }
        .border-accent-400 { border-color: var(--accent-400); }
        .border-accent-500 { border-color: var(--accent-500); }
        .border-accent-600 { border-color: var(--accent-600); }
        .border-accent-700 { border-color: var(--accent-700); }
        .border-accent-800 { border-color: var(--accent-800); }
        .border-accent-900 { border-color: var(--accent-900); }

        
        .hover\:bg-primary-500:hover { background-color: var(--primary-500); }
        .hover\:bg-primary-600:hover { background-color: var(--primary-600); }
        .hover\:bg-secondary-500:hover { background-color: var(--secondary-500); }
        .hover\:bg-secondary-600:hover { background-color: var(--secondary-600); }
        .hover\:bg-neutral-500:hover { background-color: var(--neutral-500); }
        .hover\:bg-neutral-600:hover { background-color: var(--neutral-600); }
        .hover\:bg-accent-500:hover { background-color: var(--accent-500); }
        .hover\:bg-accent-600:hover { background-color: var(--accent-600); }

        
        .focus\:ring-primary-500:focus { --tw-ring-color: var(--primary-500); }
        .focus\:ring-secondary-500:focus { --tw-ring-color: var(--secondary-500); }
        .focus\:ring-neutral-500:focus { --tw-ring-color: var(--neutral-500); }
        .focus\:ring-accent-500:focus { --tw-ring-color: var(--accent-500); }
          body {
            background-color: #f8fafc;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          }
          
          .brand-gradient {
            background: linear-gradient(90deg, #0ea5e9 0%, #10b981 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .btn-gradient {
            background: linear-gradient(90deg, #0ea5e9 0%, #10b981 100%);
          }
          
          .btn-gradient:hover {
            background: linear-gradient(90deg, #0284c7 0%, #059669 100%);
          }
          
          .neumorphic {
            border-radius: 16px;
            background: #f8fafc;
            box-shadow: 9px 9px 18px #d1d9e6, -9px -9px 18px #ffffff;
            transition: all 0.3s ease;
          }
          
          .neumorphic:hover {
            box-shadow: 12px 12px 24px #c4cbd9, -12px -12px 24px #ffffff;
          }
          
          .neumorphic-inset {
            border-radius: 16px;
            background: #f8fafc;
            box-shadow: inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff;
          }
          
          .neumorphic-card {
            border-radius: 16px;
            background: #f8fafc;
            box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
            transition: all 0.3s ease;
          }
          
          .neumorphic-card:hover {
            box-shadow: 8px 8px 16px #c4cbd9, -8px -8px 16px #ffffff;
            transform: translateY(-5px);
          }
          button,a{
            cursor: pointer;
            }
          .btn-neu {
            transition: all 0.2s ease;
            box-shadow: 4px 4px 8px #d1d9e6, -2px -2px 6px #ffffff;
          }
          
          .btn-neu:hover {
            box-shadow: 6px 6px 12px #c4cbd9, -3px -3px 7px #ffffff;
            transform: translateY(-2px);
          }
          
          .btn-neu:active {
            box-shadow: inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff;
            transform: translateY(0);
          }
          
          .heatmap-day {
            transition: all 0.2s ease;
          }
          
          .heatmap-day:hover {
            transform: translateY(-3px);
            z-index: 10;
          }
          
          .masonry-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 20px;
            grid-auto-flow: dense;
          }
          
          .achievement-badge {
            transition: all 0.3s ease;
          }
          
          .achievement-badge:hover {
            transform: scale(1.05);
          }
          
          .achievement-unlock-animation {
            animation: unlockPulse 1.5s ease-in-out;
          }
          
          @keyframes unlockPulse {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .payment-step-enter {
            animation: stepSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes stepSlideIn {
            0% { opacity: 0; transform: translateX(30px); }
            100% { opacity: 1; transform: translateX(0); }
          }

          .payment-step-back {
            animation: stepSlideBack 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes stepSlideBack {
            0% { opacity: 0; transform: translateX(-30px); }
            100% { opacity: 1; transform: translateX(0); }
          }

          @keyframes processingPulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.15); opacity: 1; }
          }

          .processing-pulse {
            animation: processingPulse 1.5s ease-in-out infinite;
          }

          @keyframes successPop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }

          .success-pop {
            animation: successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          @keyframes progressBar {
            0% { width: 0%; }
            100% { width: 100%; }
          }

          .progress-bar-animate {
            animation: progressBar 2s ease-in-out forwards;
          }

          @keyframes confettiFall {
            0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
          }

          .confetti-piece {
            animation: confettiFall 3s ease-in forwards;
          }
        `}
			</style>

			<div className="bg-primary-600 text-white text-center py-2 px-4 text-sm font-medium">
				<div className="container mx-auto flex items-center justify-center">
					<FaInfoCircle className="mr-2" />
					<p>
						Join our community of regular donors and get special achievement
						badges.
						<a
							href="#"
							className="underline font-semibold hover:text-primary-100 transition-colors ml-2"
						>
							Learn more
						</a>
					</p>
				</div>
			</div>

			<header className="py-4 px-6 sm:px-10 bg-white shadow-sm sticky top-0 z-40">
				<div className="container mx-auto">
					<div className="flex justify-between items-center">
						<div className="flex items-center">
							<div className="w-10 h-10 mr-3 rounded-full flex items-center justify-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
								<FaHandHoldingHeart />
							</div>
							<h1 className="text-sm sm:text-2xl font-bold brand-gradient">
								DonorHub
							</h1>
						</div>

						<nav className="hidden md:flex items-center space-x-8">
							<button
								className={`nav-link ${
									activeSection === "dashboard"
										? "text-primary-600 font-medium"
										: "text-neutral-700 hover:text-primary-600 transition-colors"
								}`}
								onClick={() => setActiveSection("dashboard")}
							>
								Dashboard
							</button>
							<button
								className={`nav-link ${
									activeSection === "donors"
										? "text-primary-600 font-medium"
										: "text-neutral-700 hover:text-primary-600 transition-colors"
								}`}
								onClick={() => setActiveSection("donors")}
							>
								Donors
							</button>
							<button
								className={`nav-link ${
									activeSection === "achievements"
										? "text-primary-600 font-medium"
										: "text-neutral-700 hover:text-primary-600 transition-colors"
								}`}
								onClick={() => setActiveSection("achievements")}
							>
								Achievements
							</button>
							<button
								className={`nav-link ${
									activeSection === "impact"
										? "text-primary-600 font-medium"
										: "text-neutral-700 hover:text-primary-600 transition-colors"
								}`}
								onClick={() => setActiveSection("impact")}
							>
								Impact
							</button>
							<button
								className={`nav-link ${
									activeSection === "help"
										? "text-primary-600 font-medium"
										: "text-neutral-700 hover:text-primary-600 transition-colors"
								}`}
								onClick={() => setActiveSection("help")}
							>
								Help
							</button>
						</nav>

						<div className="flex items-center space-x-4">
							<button
								onClick={() => setShowNewDonationModal(true)}
								className="hidden sm:flex btn-neu items-center py-2 px-4 rounded-full text-primary-600 font-medium"
							>
								<FaHeart className="mr-2" />
								<span>New Donation</span>
							</button>

							<div className="relative group" ref={profileRef}>
								<button
									onClick={() => setShowProfileModal(!showProfileModal)}
									className="flex items-center btn-neu py-2 px-4 text-neutral-700 rounded-full"
								>
									<span className="hidden sm:inline mr-2">
										{currentUser?.name || "Guest"}
									</span>
									<div
										className="w-8 h-8 rounded-full bg-cover bg-center"
										style={{
											backgroundImage: `url(${
												currentUser?.avatar || getRandomAvatar(0)
											})`,
										}}
									></div>
								</button>

								{showProfileModal && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg neumorphic-card z-50">
										<div className="py-2">
											<button
												onClick={() => {
													setActiveSection("profile");
													setShowProfileModal(false);
												}}
												className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
											>
												<FaUsers className="inline mr-2" /> Profile
											</button>

											<button
												onClick={() => {
													setActiveSection("achievements");
													setShowProfileModal(false);
												}}
												className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
											>
												<FaTrophy className="inline mr-2" /> Achievements
											</button>
											<div className="border-t border-neutral-200 my-1"></div>
											<button
												onClick={() => setShowProfileModal(false)}
												className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
											>
												<FaSignOutAlt className="inline mr-2" /> Sign out
											</button>
										</div>
									</div>
								)}
							</div>

							<button
								onClick={() => setShowMobileMenu(!showMobileMenu)}
								className="md:hidden btn-neu w-10 h-10 rounded-full flex items-center justify-center text-neutral-700"
							>
								{showMobileMenu ? <FaTimes /> : <FaBars />}
							</button>
						</div>
					</div>

					{showMobileMenu && (
						<div className="md:hidden mt-4 neumorphic-inset p-4 rounded-xl animate-slide-down">
							<nav className="flex flex-col space-y-3">
								<button
									onClick={() => {
										setActiveSection("dashboard");
										setShowMobileMenu(false);
									}}
									className={`py-2 px-3 rounded-lg ${
										activeSection === "dashboard"
											? "bg-primary-50 text-primary-600 font-medium"
											: "text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
									} transition-colors`}
								>
									Dashboard
								</button>
								<button
									onClick={() => {
										setActiveSection("donors");
										setShowMobileMenu(false);
									}}
									className={`py-2 px-3 rounded-lg ${
										activeSection === "donors"
											? "bg-primary-50 text-primary-600 font-medium"
											: "text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
									} transition-colors`}
								>
									Donors
								</button>
								<button
									onClick={() => {
										setActiveSection("achievements");
										setShowMobileMenu(false);
									}}
									className={`py-2 px-3 rounded-lg ${
										activeSection === "achievements"
											? "bg-primary-50 text-primary-600 font-medium"
											: "text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
									} transition-colors`}
								>
									Achievements
								</button>
								<button
									onClick={() => {
										setActiveSection("impact");
										setShowMobileMenu(false);
									}}
									className={`py-2 px-3 rounded-lg ${
										activeSection === "impact"
											? "bg-primary-50 text-primary-600 font-medium"
											: "text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
									} transition-colors`}
								>
									Impact
								</button>
								<button
									onClick={() => {
										setActiveSection("help");
										setShowMobileMenu(false);
									}}
									className={`py-2 px-3 rounded-lg ${
										activeSection === "help"
											? "bg-primary-50 text-primary-600 font-medium"
											: "text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
									} transition-colors`}
								>
									Help
								</button>
								<button
									onClick={() => {
										setShowNewDonationModal(true);
										setShowMobileMenu(false);
									}}
									className="mt-2 py-2 px-3 btn-gradient text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
								>
									<FaHeart className="inline mr-2" />
									<span>New Donation</span>
								</button>
							</nav>
						</div>
					)}
				</div>
			</header>

			{activeSection === "dashboard" && (
				<section className="bg-gradient-to-b from-white to-primary-50 py-10 sm:py-16 overflow-hidden">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div className="animate-slide-right">
								<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 leading-tight mb-4">
									Recognize Your
									<span className="brand-gradient ml-2">
										Valuable Donors
									</span>{" "}
									with Style
								</h1>
								<p className="text-lg text-neutral-600 mb-8 max-w-lg">
									Track contributions, celebrate milestones, and visualize your
									community's impact. Reward your supporters with achievements
									that acknowledge their generosity.
								</p>
								<div className="flex flex-wrap gap-4">
									<button
										onClick={() => setShowNewDonationModal(true)}
										className="py-3 px-6 btn-gradient text-white font-medium rounded-full shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 btn-gradient-hover"
									>
										<FaHeart className="inline mr-2" />
										Make a Donation
									</button>
									<button
										onClick={() => setActiveSection("achievements")}
										className="py-3 px-6 bg-white text-primary-600 font-medium rounded-full shadow-md hover:shadow-lg transform transition-all hover:-translate-y-1"
									>
										<FaTrophy className="inline mr-2" />
										View Achievements
									</button>
								</div>
							</div>
							<div className="relative animate-slide-left">
								<div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
								<div className="absolute -left-10 -bottom-10 w-48 h-48 bg-secondary-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
								<img
									src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2000&auto=format&fit=crop"
									alt="People collaborating on community projects"
									className="rounded-2xl neumorphic w-full max-w-lg mx-auto object-cover h-auto float-animation"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
							<div
								className="neumorphic-card p-5 animate-slide-up"
								style={{ animationDelay: "0.1s" }}
							>
								<div className="flex flex-col items-center text-center">
									<div className="w-12 h-12 mb-3 rounded-full flex items-center justify-center bg-primary-100 text-primary-600">
										<FaHandHoldingHeart className="text-xl" />
									</div>
									<h3 className="text-2xl sm:text-3xl font-bold text-neutral-800">
										{formatCurrency(
											donors.reduce((sum, donor) => sum + donor.totalDonated, 0)
										)}
									</h3>
									<p className="text-sm text-neutral-600">Total Donations</p>
								</div>
							</div>
							<div
								className="neumorphic-card p-5 animate-slide-up"
								style={{ animationDelay: "0.2s" }}
							>
								<div className="flex flex-col items-center text-center">
									<div className="w-12 h-12 mb-3 rounded-full flex items-center justify-center bg-secondary-100 text-secondary-600">
										<FaUsers className="text-xl" />
									</div>
									<h3 className="text-2xl sm:text-3xl font-bold text-neutral-800">
										{donors.length}
									</h3>
									<p className="text-sm text-neutral-600">Active Donors</p>
								</div>
							</div>
							<div
								className="neumorphic-card p-5 animate-slide-up"
								style={{ animationDelay: "0.3s" }}
							>
								<div className="flex flex-col items-center text-center">
									<div className="w-12 h-12 mb-3 rounded-full flex items-center justify-center bg-primary-100 text-primary-600">
										<FaMedal className="text-xl" />
									</div>
									<h3 className="text-2xl sm:text-3xl font-bold text-neutral-800">
										{donors.reduce(
											(total, donor) =>
												total +
												donor.achievements.filter((a) => a.isUnlocked).length,
											0
										)}
									</h3>
									<p className="text-sm text-neutral-600">
										Achievements Earned
									</p>
								</div>
							</div>
							<div
								className="neumorphic-card p-5 animate-slide-up"
								style={{ animationDelay: "0.4s" }}
							>
								<div className="flex flex-col items-center text-center">
									<div className="w-12 h-12 mb-3 rounded-full flex items-center justify-center bg-secondary-100 text-secondary-600">
										<FaChartLine className="text-xl" />
									</div>
									<h3 className="text-2xl sm:text-3xl font-bold text-neutral-800">
										{Math.round(
											donors.reduce(
												(sum, donor) => sum + donor.totalDonated,
												0
											) / donors.length
										)}
									</h3>
									<p className="text-sm text-neutral-600">Avg. Donation</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}

			<div className="bg-white border-b border-neutral-200">
				<div className="container mx-auto py-2 px-4 sm:px-6 lg:px-8">
					<div className="flex items-center text-sm text-neutral-500">
						<a href="#" className="hover:text-primary-600 transition-colors">
							Home
						</a>
						<svg
							className="h-4 w-4 mx-2 text-neutral-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
						<span className="text-neutral-700 font-medium">
							{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
						</span>
					</div>
				</div>
			</div>

			<main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{activeSection === "dashboard" && (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2">
							<div className="neumorphic p-6 animate-slide-up">
								<div className="flex flex-wrap justify-between items-center mb-6">
									<h2 className="text-xl font-semibold text-neutral-800 flex items-center">
										<FaCalendarAlt className="text-primary-500 mr-2" />
										Donation Activity Heatmap
									</h2>
								</div>

								<div className="mb-6 overflow-x-auto">
									<div className="min-w-max">
										<div className="flex mb-4 pl-20">
											{Array.from({ length: 12 }, (_, i) => {
												const date = new Date();
												date.setMonth(date.getMonth() - 11 + i);
												const daysInMonth = new Date(
													date.getFullYear(),
													date.getMonth() + 1,
													0
												).getDate();
												const weeksInMonth = Math.ceil(daysInMonth / 7);

												return (
													<div
														key={i}
														className="text-sm text-center font-medium text-neutral-600"
														style={{ width: `${weeksInMonth * 24}px` }}
													>
														{date.toLocaleDateString("en-US", {
															month: "short",
														})}
													</div>
												);
											})}
										</div>

										<div className="flex">
											<div className="flex flex-col w-16 pr-4">
												{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
													(day, index) => (
														<div
															key={day}
															className="text-sm text-neutral-500 text-right flex items-center justify-end h-8"
														>
															{day}
														</div>
													)
												)}
											</div>

											<div className="flex">
												{(() => {
													const weeks = [];
													const today = new Date();
													const startDate = new Date();
													startDate.setDate(today.getDate() - 365);

													const firstSunday = new Date(startDate);
													firstSunday.setDate(
														startDate.getDate() - startDate.getDay()
													);

													let currentDate = new Date(firstSunday);
													let weekIndex = 0;

													while (currentDate <= today) {
														const weekData = [];

														for (
															let dayOfWeek = 0;
															dayOfWeek < 7;
															dayOfWeek++
														) {
															const dateStr = currentDate
																.toISOString()
																.split("T")[0];
															const dayData = heatmapData.find(
																(d) => d.date === dateStr
															);

															const isOutsideRange =
																currentDate < startDate || currentDate > today;

															let bgColor = "bg-neutral-100";
															if (
																dayData &&
																dayData.count > 0 &&
																!isOutsideRange
															) {
																if (dayData.count >= 10)
																	bgColor = "bg-primary-800";
																else if (dayData.count >= 7)
																	bgColor = "bg-primary-600";
																else if (dayData.count >= 5)
																	bgColor = "bg-primary-500";
																else if (dayData.count >= 3)
																	bgColor = "bg-primary-400";
																else if (dayData.count >= 1)
																	bgColor = "bg-primary-300";
															} else if (isOutsideRange) {
																bgColor = "bg-transparent";
															}

															weekData.push(
																<div
																	key={`${weekIndex}-${dayOfWeek}`}
																	className={`w-6 h-6 rounded-sm heatmap-day ${bgColor} cursor-pointer transition-all hover:ring-2 hover:ring-primary-400 hover:ring-opacity-50 hover:scale-110 ${
																		isOutsideRange ? "opacity-30" : ""
																	}`}
																	style={{
																		marginBottom: "3px",
																		marginTop: "3px",
																	}}
																	title={
																		dayData && !isOutsideRange
																			? `${dayData.date}: ${dayData.count} donations (${dayData.amount})`
																			: currentDate.toDateString()
																	}
																></div>
															);

															currentDate.setDate(currentDate.getDate() + 1);
														}

														weeks.push(
															<div
																key={weekIndex}
																className="flex flex-col gap-0.5 mr-1"
															>
																{weekData}
															</div>
														);

														weekIndex++;
													}

													return weeks;
												})()}
											</div>
										</div>
									</div>
								</div>

								<div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-200">
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-sm bg-neutral-100 mr-1"></div>
										<span className="text-xs text-neutral-600">0</span>
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-sm bg-primary-300 mr-1"></div>
										<span className="text-xs text-neutral-600">1-2</span>
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-sm bg-primary-400 mr-1"></div>
										<span className="text-xs text-neutral-600">3-4</span>
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-sm bg-primary-500 mr-1"></div>
										<span className="text-xs text-neutral-600">5-6</span>
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-sm bg-primary-600 mr-1"></div>
										<span className="text-xs text-neutral-600">7-9</span>
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 rounded-sm bg-primary-800 mr-1"></div>
										<span className="text-xs text-neutral-600">10+</span>
									</div>
								</div>
							</div>

							<div
								className="neumorphic p-6 mt-8 animate-slide-up"
								style={{ animationDelay: "0.1s" }}
							>
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-xl font-semibold text-neutral-800 flex items-center">
										<FaUsers className="text-primary-500 mr-2" />
										Recent Donors
									</h2>
									<button
										onClick={() => setActiveSection("donors")}
										className="btn-neu py-2 px-4 text-sm text-primary-600 rounded-lg flex items-center"
									>
										View All
										<svg
											className="h-4 w-4 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</button>
								</div>

								<div className="space-y-4">
									{donors.slice(0, 5).map((donor) => (
										<div
											key={donor.id}
											className="flex items-center p-4 neumorphic-inset rounded-lg hover:bg-primary-50 transition-colors"
										>
											<img
												src={donor.avatar}
												alt={donor.name}
												className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-white shadow-sm"
											/>
											<div className="flex-1">
												<h3 className="text-base font-medium text-neutral-800 flex items-center">
													{donor.name}
													{donor.level >= 5 && (
														<span className="ml-2 inline-flex items-center justify-center bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-0.5 rounded-full">
															Lvl {donor.level}
														</span>
													)}
												</h3>
												<p className="text-sm text-neutral-600">
													{donor.type === "recurring" ||
													donor.type === "monthly" ||
													donor.type === "annual"
														? `${
																donor.type.charAt(0).toUpperCase() +
																donor.type.slice(1)
														  } donor`
														: "One-time donor"}{" "}
													• {donor.cause}
												</p>
											</div>
											<div className="text-right">
												<p className="text-base font-semibold text-neutral-800">
													{formatCurrency(donor.amount)}
												</p>
												<p className="text-xs text-neutral-500">
													{formatDate(donor.date)}
												</p>
											</div>
										</div>
									))}
								</div>

								<button
									onClick={() => setActiveSection("donors")}
									className="mt-6 py-2 px-4 btn-neu w-full text-primary-600 font-medium rounded-lg flex items-center justify-center"
								>
									<span>View All Donors</span>
									<svg
										className="h-4 w-4 ml-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
							</div>

							<div
								className="neumorphic p-6 mt-8 animate-slide-up"
								style={{ animationDelay: "0.2s" }}
							>
								<h2 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
									<FaTrophy className="text-primary-500 mr-2" />
									Donor Leaderboard
								</h2>

								<div className="space-y-5">
									{topDonors.map((donor, index) => (
										<div key={donor.id} className="relative">
											{index === 0 && (
												<div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 shadow-lg flex items-center justify-center text-white">
													<FaCrown className="text-lg" />
												</div>
											)}

											<div
												className={`flex items-center p-4 ${
													index === 0
														? "bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200"
														: "neumorphic-inset"
												} rounded-lg`}
											>
												<div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold mr-4">
													{index + 1}
												</div>

												<img
													src={donor.avatar}
													alt={donor.name}
													className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-white shadow-sm"
												/>

												<div className="flex-1">
													<h3 className="text-base font-medium text-neutral-800 flex items-center">
														{donor.name}
														<span className="ml-2 text-xs font-medium text-neutral-500">
															Level {donor.level}
														</span>
													</h3>

													<div className="mt-1">
														{donor.achievements
															.filter((a) => a.isUnlocked)
															.slice(0, 3)
															.map((achievement) => (
																<span
																	key={achievement.id}
																	className="inline-block mr-1"
																	title={achievement.title}
																>
																	{achievement.icon === "heart" && (
																		<IoMdHeart className="text-primary-500" />
																	)}
																	{achievement.icon === "medal" && (
																		<FaMedal className="text-secondary-500" />
																	)}
																	{achievement.icon === "trophy" && (
																		<FaTrophy className="text-accent-500" />
																	)}
																	{achievement.icon === "crown" && (
																		<FaCrown className="text-yellow-500" />
																	)}
																	{achievement.icon === "fire" && (
																		<FaFireAlt className="text-red-500" />
																	)}
																	{achievement.icon === "star" && (
																		<FaStar className="text-purple-500" />
																	)}
																</span>
															))}
														{donor.achievements.filter((a) => a.isUnlocked)
															.length > 3 && (
															<span className="text-xs text-neutral-500">
																+
																{donor.achievements.filter((a) => a.isUnlocked)
																	.length - 3}
															</span>
														)}
													</div>
												</div>

												<div className="text-right">
													<p className="text-base font-semibold text-neutral-800">
														{formatCurrency(donor.totalDonated)}
													</p>
													<p className="text-xs text-neutral-500">
														Total donated
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="lg:col-span-1">
							{currentUser && (
								<div
									className="neumorphic p-6 animate-slide-up"
									style={{ animationDelay: "0.2s" }}
								>
									<div className="flex flex-col items-center mb-6">
										<div className="relative">
											<img
												src={currentUser.avatar}
												alt={currentUser.name}
												className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4"
											/>
											<div className="absolute bottom-2 -right-2 bg-primary-100 text-primary-800 rounded-full px-2 py-1 text-xs font-bold shadow-md border border-white">
												Level {currentUser.level}
											</div>
										</div>
										<h2 className="text-xl font-semibold text-neutral-800">
											{currentUser.name}
										</h2>
										<p className="text-sm text-neutral-600 mt-1">
											{
												currentUser.achievements.filter((a) => a.isUnlocked)
													.length
											}{" "}
											achievements
										</p>

										<div className="w-full mt-4">
											<div className="flex justify-between items-center mb-1">
												<span className="text-xs font-medium text-neutral-600">
													Level {currentUser.level}
												</span>
												<span className="text-xs font-medium text-neutral-600">
													Level {currentUser.level + 1}
												</span>
											</div>
											<div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
												<div
													className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
													style={{
														width: `${
															((currentUser.totalDonated % 100) / 100) * 100
														}%`,
													}}
												></div>
											</div>
											<p className="text-xs text-neutral-500 mt-1 text-center">
												{formatCurrency(100 - (currentUser.totalDonated % 100))}{" "}
												to next level
											</p>
										</div>
									</div>

									<h3 className="text-base font-medium text-neutral-800 mb-3 flex items-center">
										<FaTrophy className="text-primary-500 mr-2" />
										Recent Achievements
									</h3>

									<div className="space-y-3 mb-6">
										{currentUser.achievements
											.filter((a) => a.isUnlocked)
											.slice(0, 3)
											.map((achievement) => (
												<div
													key={achievement.id}
													className="flex items-center p-3 bg-white rounded-lg shadow-sm"
												>
													<div
														className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
														style={{
															backgroundColor: `${achievement.color}20`,
															color: achievement.color,
														}}
													>
														{achievement.icon === "heart" && (
															<IoMdHeart className="text-xl" />
														)}
														{achievement.icon === "medal" && (
															<FaMedal className="text-xl" />
														)}
														{achievement.icon === "trophy" && (
															<FaTrophy className="text-xl" />
														)}
														{achievement.icon === "crown" && (
															<FaCrown className="text-xl" />
														)}
														{achievement.icon === "fire" && (
															<FaFireAlt className="text-xl" />
														)}
														{achievement.icon === "star" && (
															<FaStar className="text-xl" />
														)}
													</div>
													<div>
														<h4 className="text-sm font-medium text-neutral-800">
															{achievement.title}
														</h4>
														<p className="text-xs text-neutral-600">
															{achievement.description}
														</p>
													</div>
												</div>
											))}
									</div>

									<button
										onClick={() => setActiveSection("achievements")}
										className="w-full py-2 px-4 btn-neu text-primary-600 font-medium rounded-lg flex items-center justify-center"
									>
										<span>View All Achievements</span>
										<svg
											className="h-4 w-4 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</button>
								</div>
							)}

							<div
								className="neumorphic p-6 mt-8 animate-slide-up"
								style={{ animationDelay: "0.3s" }}
							>
								<div className="flex flex-col justify-center items-center gap-2">
									<h2 className="text-xl font-semibold text-neutral-800 flex items-center">
										<FaChartLine className="text-primary-500 mr-2" />
										Monthly Stats
									</h2>
									<div className="flex justify-between items-center mb-6">
										<div className="flex items-center space-x-2">
											<button
												onClick={() => changeMonth(-1)}
												className="btn-neu w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-primary-600"
											>
												<FaChevronDown />
											</button>
											<span className="text-neutral-700 font-medium">
												{getMonthName(activeMonth)} {activeYear}
											</span>
											<button
												onClick={() => changeMonth(1)}
												className="btn-neu w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-primary-600"
											>
												<FaChevronUp />
											</button>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-5 mb-6">
									<div className="p-4 neumorphic-inset rounded-lg">
										<div className="flex items-center justify-between mb-3">
											<h3 className="text-base font-medium text-neutral-700">
												Total Donations
											</h3>
											<div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
												<BsGraphUp className="text-lg" />
											</div>
										</div>
										<p className="text-2xl font-bold text-neutral-800 flex items-center justify-center">
											{formatCurrency(monthlyStats.totalDonated)}
										</p>
										<div className="flex items-center mt-2 flex items-center justify-center">
											<span className="text-xs text-green-600 flex items-center">
												<FiChevronsUp className="mr-1" />
												+12% from last month
											</span>
										</div>
									</div>

									<div className="p-4 neumorphic-inset rounded-lg">
										<div className="flex items-center justify-between mb-3">
											<h3 className="text-base font-medium text-neutral-700">
												Donor Count
											</h3>
											<div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
												<RiUserHeartFill className="text-lg" />
											</div>
										</div>
										<p className="text-2xl font-bold text-neutral-800 flex items-center justify-center">
											{monthlyStats.donorCount}
										</p>
										<div className="flex items-center mt-2 flex items-center justify-center">
											<span className="text-xs text-green-600 flex items-center">
												<FiChevronsUp className="mr-1" />
												+5 new donors
											</span>
										</div>
									</div>

									<div className="p-4 neumorphic-inset rounded-lg">
										<div className="flex items-center justify-between mb-3">
											<h3 className="text-base font-medium text-neutral-700">
												Average Donation
											</h3>
											<div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
												<BsLightningChargeFill className="text-lg" />
											</div>
										</div>
										<p className="text-2xl font-bold text-neutral-800 flex items-center justify-center">
											{formatCurrency(monthlyStats.averageDonation)}
										</p>
										<div className="flex items-center mt-2 flex items-center justify-center">
											<span className="text-xs text-green-600 flex items-center">
												<FiChevronsUp className="mr-1" />
												+8% from last month
											</span>
										</div>
									</div>
								</div>
							</div>

							<div
								className="neumorphic p-6 mt-8 animate-slide-up"
								style={{ animationDelay: "0.4s" }}
							>
								<h2 className="text-xl font-semibold text-neutral-800 flex items-center mb-4">
									<FaHeart className="text-primary-500 mr-2" />
									Make a Difference
								</h2>
								<p className="text-neutral-600 text-sm mb-6">
									Your donation helps support important causes and unlocks
									special achievements.
								</p>

								<button
									onClick={() => setShowNewDonationModal(true)}
									className="w-full py-3 px-4 btn-gradient text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 btn-gradient-hover"
								>
									Donate Now
								</button>
							</div>
						</div>
					</div>
				)}

				{activeSection === "donors" && (
					<div className="animate-slide-up">
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
							<div>
								<h1 className="text-2xl font-bold text-neutral-800 mb-2">
									Donor Directory
								</h1>
								<p className="text-neutral-600">
									Browse and filter our amazing donors community
								</p>
							</div>

							<div className="flex flex-wrap gap-3">
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FaSearch className="text-neutral-400" />
									</div>
									<input
										type="text"
										placeholder="Search donors..."
										className="neumorphic-inset py-2 pl-10 pr-4 rounded-lg focus:outline-none"
										value={filters.search}
										onChange={(e) =>
											setFilters({ ...filters, search: e.target.value })
										}
									/>
								</div>

								<select
									className="neumorphic-inset py-2 px-4 rounded-lg appearance-none bg-right pr-8"
									value={filters.type}
									onChange={(e) =>
										setFilters({ ...filters, type: e.target.value })
									}
									style={{
										backgroundImage:
											"url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "right 0.5rem center",
										backgroundSize: "1.5em 1.5em",
									}}
								>
									<option value="all">All Types</option>
									<option value="one-time">One-time</option>
									<option value="recurring">Recurring</option>
									<option value="monthly">Monthly</option>
									<option value="annual">Annual</option>
								</select>

								<select
									className="neumorphic-inset py-2 px-4 rounded-lg appearance-none bg-right pr-8"
									value={filters.amountRange}
									onChange={(e) =>
										setFilters({ ...filters, amountRange: e.target.value })
									}
									style={{
										backgroundImage:
											"url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "right 0.5rem center",
										backgroundSize: "1.5em 1.5em",
									}}
								>
									<option value="all">All Amounts</option>
									<option value="10-50">$10 - $50</option>
									<option value="51-100">$51 - $100</option>
									<option value="101-500">$101 - $500</option>
									<option value="501">$501+</option>
								</select>

								<select
									className="neumorphic-inset py-2 px-4 rounded-lg appearance-none bg-right pr-8"
									value={filters.cause}
									onChange={(e) =>
										setFilters({ ...filters, cause: e.target.value })
									}
									style={{
										backgroundImage:
											"url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "right 0.5rem center",
										backgroundSize: "1.5em 1.5em",
									}}
								>
									<option value="all">All Causes</option>
									{causes.map((cause) => (
										<option key={cause} value={cause}>
											{cause}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="masonry-grid">
							{filteredDonors.map((donor) => (
								<div
									key={donor.id}
									className="neumorphic-card p-5 animate-slide-up"
								>
									<div className="flex items-center mb-4">
										<img
											src={donor.avatar}
											alt={donor.name}
											className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
										/>
										<div className="ml-3">
											<h3 className="text-lg font-medium text-neutral-800">
												{donor.name}
											</h3>
											<div className="flex items-center">
												<span className="inline-flex items-center justify-center bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
													Level {donor.level}
												</span>
												<span className="text-sm text-neutral-600">
													{donor.type === "recurring" ||
													donor.type === "monthly" ||
													donor.type === "annual"
														? `${
																donor.type.charAt(0).toUpperCase() +
																donor.type.slice(1)
														  } donor`
														: "One-time donor"}
												</span>
											</div>
										</div>
									</div>

									<div className="mb-4 p-3 bg-neutral-50 rounded-lg">
										<div className="flex justify-between items-center mb-1">
											<span className="text-sm font-medium text-neutral-700">
												Recent Donation
											</span>
											<span className="text-sm font-semibold text-primary-600">
												{formatCurrency(donor.amount)}
											</span>
										</div>
										<div className="flex justify-between items-center mb-1">
											<span className="text-sm font-medium text-neutral-700">
												Total Contributed
											</span>
											<span className="text-sm font-semibold text-secondary-600">
												{formatCurrency(donor.totalDonated)}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-neutral-700">
												Cause
											</span>
											<span className="text-sm font-semibold text-neutral-600">
												{donor.cause}
											</span>
										</div>
									</div>

									<div className="mb-4">
										<h4 className="text-sm font-medium text-neutral-700 mb-2">
											Achievements
										</h4>
										<div className="flex flex-wrap gap-2">
											{donor.achievements.map((achievement) => (
												<div
													key={achievement.id}
													className={`flex items-center justify-center w-9 h-9 rounded-full ${
														achievement.isUnlocked
															? "achievement-badge"
															: "opacity-30"
													}`}
													style={{
														backgroundColor: achievement.isUnlocked
															? `${achievement.color}20`
															: "#f1f5f9",
														color: achievement.isUnlocked
															? achievement.color
															: "#94a3b8",
													}}
													title={
														achievement.isUnlocked
															? achievement.title
															: "Locked achievement"
													}
												>
													{achievement.icon === "heart" && (
														<IoMdHeart
															className={`text-lg ${
																!achievement.isUnlocked && "opacity-50"
															}`}
														/>
													)}
													{achievement.icon === "medal" && (
														<FaMedal
															className={`text-lg ${
																!achievement.isUnlocked && "opacity-50"
															}`}
														/>
													)}
													{achievement.icon === "trophy" && (
														<FaTrophy
															className={`text-lg ${
																!achievement.isUnlocked && "opacity-50"
															}`}
														/>
													)}
													{achievement.icon === "crown" && (
														<FaCrown
															className={`text-lg ${
																!achievement.isUnlocked && "opacity-50"
															}`}
														/>
													)}
													{achievement.icon === "fire" && (
														<FaFireAlt
															className={`text-lg ${
																!achievement.isUnlocked && "opacity-50"
															}`}
														/>
													)}
													{achievement.icon === "star" && (
														<FaStar
															className={`text-lg ${
																!achievement.isUnlocked && "opacity-50"
															}`}
														/>
													)}
													{achievement.icon === "gem" && (
														<BsFillCalendarHeartFill
															className={`text-lg ${
																!achievement.isUnlocked && "opacity-50"
															}`}
														/>
													)}
												</div>
											))}
										</div>
									</div>

									<div className="text-right">
										<span className="text-xs text-neutral-500">
											Last donation on {formatDate(donor.date)}
										</span>
									</div>
								</div>
							))}
						</div>

						{filteredDonors.length === 0 && (
							<div className="text-center py-12">
								<div className="text-5xl mb-4">🔍</div>
								<h3 className="text-xl font-medium text-neutral-700 mb-2">
									No donors found
								</h3>
								<p className="text-neutral-600">
									Try adjusting your filters or search term
								</p>
							</div>
						)}
					</div>
				)}

				{activeSection === "achievements" && (
					<div className="animate-slide-up">
						<div className="text-center mb-10">
							<h1 className="text-3xl font-bold text-neutral-800 mb-3">
								Donor Achievements
							</h1>
							<p className="text-lg text-neutral-600 max-w-2xl mx-auto">
								Unlock these special badges by donating and supporting our
								causes. Each achievement represents your growing impact.
							</p>
						</div>

						{currentUser && (
							<div className="neumorphic p-6 mb-8">
								<h2 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center">
									<FaTrophy className="text-primary-500 mr-2" />
									Your Achievement Progress
								</h2>

								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
									{currentUser.achievements.map((achievement) => (
										<div
											key={achievement.id}
											className={`p-5 rounded-xl ${
												achievement.isUnlocked
													? "neumorphic-card"
													: "neumorphic-inset opacity-75"
											}`}
										>
											<div className="flex items-center mb-4">
												<div
													className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 ${
														achievement.isUnlocked
															? "achievement-badge"
															: "opacity-50"
													}`}
													style={{
														backgroundColor: achievement.isUnlocked
															? `${achievement.color}20`
															: "#f1f5f9",
														color: achievement.isUnlocked
															? achievement.color
															: "#94a3b8",
													}}
												>
													{achievement.icon === "heart" && (
														<IoMdHeart className="text-2xl" />
													)}
													{achievement.icon === "medal" && (
														<FaMedal className="text-2xl" />
													)}
													{achievement.icon === "trophy" && (
														<FaTrophy className="text-2xl" />
													)}
													{achievement.icon === "crown" && (
														<FaCrown className="text-2xl" />
													)}
													{achievement.icon === "fire" && (
														<FaFireAlt className="text-2xl" />
													)}
													{achievement.icon === "star" && (
														<FaStar className="text-2xl" />
													)}
													{achievement.icon === "gem" && (
														<BsFillCalendarHeartFill className="text-2xl" />
													)}
												</div>
												<div>
													<h3 className="text-base font-medium text-neutral-800">
														{achievement.title}
													</h3>
													<p className="text-sm text-neutral-600">
														{achievement.description}
													</p>
												</div>
											</div>

											{achievement.isUnlocked ? (
												<div className="flex items-center text-green-600 text-sm">
													<FaCheckCircle className="mr-2" />
													<span>Unlocked</span>
												</div>
											) : (
												<div>
													<div className="flex justify-between items-center mb-1">
														<span className="text-xs text-neutral-600">
															Progress
														</span>
														<span className="text-xs font-medium text-neutral-700">
															{achievement.id.includes("dollars")
																? `${formatCurrency(
																		currentUser.totalDonated
																  )} / ${formatCurrency(
																		achievement.unlockedAt
																  )}`
																: `${
																		currentUser.achievements.filter(
																			(a) => a.isUnlocked
																		).length
																  } / ${achievement.unlockedAt}`}
														</span>
													</div>
													<div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
														<div
															className="h-full bg-gradient-to-r from-neutral-400 to-neutral-500"
															style={{
																width: `${
																	achievement.id.includes("dollars")
																		? Math.min(
																				100,
																				(currentUser.totalDonated /
																					achievement.unlockedAt) *
																					100
																		  )
																		: Math.min(
																				100,
																				(currentUser.achievements.filter(
																					(a) => a.isUnlocked
																				).length /
																					achievement.unlockedAt) *
																					100
																		  )
																}%`,
															}}
														></div>
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}

						<div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 rounded-2xl text-white mb-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
								<div>
									<h2 className="text-2xl text-accent-500 font-bold mb-4">
										Ready to Earn More Achievements?
									</h2>
									<p className="text-primary-800 mb-6">
										Make a donation today and unlock new badges that showcase
										your generosity and commitment.
									</p>
									<button
										onClick={() => setShowNewDonationModal(true)}
										className="py-3 px-6 bg-white text-primary-600 font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all hover:-translate-y-1"
									>
										<FaHeart className="inline mr-2" />
										Donate Now
									</button>
								</div>
								<div className="flex justify-center">
									<div className="grid grid-cols-3 gap-4">
										{Array.from({ length: 6 }).map((_, i) => (
											<div
												key={i}
												className="w-16 h-16 rounded-full flex items-center justify-center achievement-badge float-animation"
												style={{
													backgroundColor:
														[
															"#0ea5e9",
															"#10b981",
															"#f97316",
															"#8b5cf6",
															"#ec4899",
															"#6366f1",
														][i % 6] + "30",
													color: [
														"#0ea5e9",
														"#10b981",
														"#f97316",
														"#8b5cf6",
														"#ec4899",
														"#6366f1",
													][i % 6],
													animationDelay: `${i * 0.2}s`,
												}}
											>
												{i === 0 && <IoMdHeart className="text-2xl" />}
												{i === 1 && <FaMedal className="text-2xl" />}
												{i === 2 && <FaTrophy className="text-2xl" />}
												{i === 3 && <FaCrown className="text-2xl" />}
												{i === 4 && <FaFireAlt className="text-2xl" />}
												{i === 5 && <FaStar className="text-2xl" />}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="neumorphic p-6 mb-8">
							<h2 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center">
								<FaQuestion className="text-primary-500 mr-2" />
								How Achievements Work
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="p-5 neumorphic-inset rounded-xl">
									<div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
										<FaHeart className="text-xl" />
									</div>
									<h3 className="text-lg font-medium text-neutral-800 mb-2">
										Make Donations
									</h3>
									<p className="text-neutral-600">
										Your journey starts with your first donation. Each
										contribution unlocks new achievements.
									</p>
								</div>

								<div className="p-5 neumorphic-inset rounded-xl">
									<div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mb-4">
										<FaMedal className="text-xl" />
									</div>
									<h3 className="text-lg font-medium text-neutral-800 mb-2">
										Earn Badges
									</h3>
									<p className="text-neutral-600">
										Badges are awarded based on donation frequency, amount, and
										consistency of your support.
									</p>
								</div>

								<div className="p-5 neumorphic-inset rounded-xl">
									<div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center mb-4">
										<BsLightningChargeFill className="text-xl" />
									</div>
									<h3 className="text-lg font-medium text-neutral-800 mb-2">
										Level Up
									</h3>
									<p className="text-neutral-600">
										As your total donations increase, you'll level up and unlock
										special recognition in the community.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeSection === "impact" && (
					<div className="animate-slide-up">
						<div className="text-center mb-10">
							<h1 className="text-3xl font-bold text-neutral-800 mb-3">
								Your Donation Impact
							</h1>
							<p className="text-lg text-neutral-600 max-w-2xl mx-auto">
								See how your contributions are making a real difference in the
								world
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
							<div className="neumorphic-card p-5">
								<div className="flex flex-col items-center text-center">
									<div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary-100 text-primary-600 mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
									</div>
									<h3 className="text-2xl font-bold text-neutral-800">
										37,840
									</h3>
									<p className="text-neutral-600 mt-1">Lives Impacted</p>
								</div>
							</div>

							<div className="neumorphic-card p-5">
								<div className="flex flex-col items-center text-center">
									<div className="w-16 h-16 rounded-full flex items-center justify-center bg-secondary-100 text-secondary-600 mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<h3 className="text-2xl font-bold text-neutral-800">128</h3>
									<p className="text-neutral-600 mt-1">Communities Served</p>
								</div>
							</div>

							<div className="neumorphic-card p-5">
								<div className="flex flex-col items-center text-center">
									<div className="w-16 h-16 rounded-full flex items-center justify-center bg-accent-100 text-accent-600 mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<h3 className="text-2xl font-bold text-neutral-800">
										256,410
									</h3>
									<p className="text-neutral-600 mt-1">Volunteer Hours</p>
								</div>
							</div>

							<div className="neumorphic-card p-5">
								<div className="flex flex-col items-center text-center">
									<div className="w-16 h-16 rounded-full flex items-center justify-center bg-purple-100 text-purple-600 mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
											/>
										</svg>
									</div>
									<h3 className="text-2xl font-bold text-neutral-800">86%</h3>
									<p className="text-neutral-600 mt-1">Donation Efficiency</p>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
							<div className="neumorphic p-6">
								<h2 className="text-xl font-semibold text-neutral-800 mb-4">
									Ocean Cleanup Impact
								</h2>
								<div className="flex items-center mb-4">
									<div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mr-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-primary-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-medium text-neutral-800">
											1,248 lbs
										</h3>
										<p className="text-neutral-600">
											Plastic removed from oceans
										</p>
									</div>
								</div>
								<div className="relative h-40 rounded-lg overflow-hidden mb-4">
									<img
										src="https://images.unsplash.com/photo-1621451537084-482c73073a0f"
										alt="Ocean cleanup"
										className="absolute inset-0 w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
									<div className="absolute bottom-3 left-3 right-3">
										<div className="flex items-center">
											<span className="bg-white/90 text-primary-600 text-xs font-semibold px-2 py-1 rounded-full">
												25% increase from last year
											</span>
										</div>
									</div>
								</div>
								<p className="text-sm text-neutral-600">
									Your donations have directly funded specialized equipment and
									volunteer efforts to remove harmful plastic from our oceans
									and coastlines.
								</p>
							</div>

							<div className="neumorphic p-6">
								<h2 className="text-xl font-semibold text-neutral-800 mb-4">
									Rainforest Preservation
								</h2>
								<div className="flex items-center mb-4">
									<div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mr-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-secondary-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-medium text-neutral-800">
											246 acres
										</h3>
										<p className="text-neutral-600">
											Rainforest land preserved
										</p>
									</div>
								</div>
								<div className="relative h-40 rounded-lg overflow-hidden mb-4">
									<img
										src="https://images.unsplash.com/photo-1560851691-ebb64b584d3d?q=80&w=2099&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
										alt="Rainforest preservation"
										className="absolute inset-0 w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
									<div className="absolute bottom-3 left-3 right-3">
										<div className="flex items-center">
											<span className="bg-white/90 text-secondary-600 text-xs font-semibold px-2 py-1 rounded-full">
												12 new acres this month
											</span>
										</div>
									</div>
								</div>
								<p className="text-sm text-neutral-600">
									Through partnerships with local conservation groups, your
									donations have helped acquire and protect vital rainforest
									habitats and biodiversity.
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
							<div className="neumorphic-card p-5">
								<div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-medium text-neutral-800 mb-2">
									Educational Support
								</h3>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-neutral-600">Yearly Goal</span>
									<span className="text-sm font-medium text-primary-600">
										1,000 students
									</span>
								</div>
								<div className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
									<div
										className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
										style={{ width: "78%" }}
									></div>
								</div>
								<p className="text-sm text-neutral-600">
									782 students provided with educational materials and
									scholarships in underserved communities.
								</p>
							</div>

							<div className="neumorphic-card p-5">
								<div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-medium text-neutral-800 mb-2">
									Clean Water Initiative
								</h3>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-neutral-600">Yearly Goal</span>
									<span className="text-sm font-medium text-secondary-600">
										50 wells
									</span>
								</div>
								<div className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
									<div
										className="h-full bg-gradient-to-r from-secondary-500 to-secondary-600"
										style={{ width: "64%" }}
									></div>
								</div>
								<p className="text-sm text-neutral-600">
									32 clean water wells installed in villages that previously
									lacked access to safe drinking water.
								</p>
							</div>

							<div className="neumorphic-card p-5">
								<div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-medium text-neutral-800 mb-2">
									Healthcare Access
								</h3>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-neutral-600">Yearly Goal</span>
									<span className="text-sm font-medium text-accent-600">
										5,000 patients
									</span>
								</div>
								<div className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
									<div
										className="h-full bg-gradient-to-r from-accent-500 to-accent-600"
										style={{ width: "92%" }}
									></div>
								</div>
								<p className="text-sm text-neutral-600">
									4,610 patients received essential healthcare services through
									mobile clinics and healthcare facilities.
								</p>
							</div>
						</div>

						<div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 rounded-2xl text-white">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
								<div>
									<h2 className="text-2xl font-bold mb-4 text-neutral-600">
										Join Us in Making a Difference
									</h2>
									<p className="text-primary-600 mb-6">
										Your donation today can help us continue these vital
										projects and expand our impact to more communities in need.
									</p>
									<button
										onClick={() => setShowNewDonationModal(true)}
										className="py-3 px-6 bg-white text-primary-600 font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all hover:-translate-y-1"
									>
										<FaHeart className="inline mr-2" />
										Donate Now
									</button>
								</div>
								<div className="flex justify-center">
									<img
										src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop"
										alt="Community impact"
										className="rounded-xl shadow-2xl max-h-60 object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeSection === "help" && (
					<div className="animate-slide-up">
						<div className="text-center mb-10">
							<h1 className="text-3xl font-bold text-neutral-800 mb-3">
								Help & Support
							</h1>
							<p className="text-lg text-neutral-600 max-w-2xl mx-auto">
								Find answers to common questions and learn how to make the most
								of your donor experience
							</p>
						</div>

						<div className="neumorphic p-6 mb-10">
							<h2 className="text-xl font-semibold text-neutral-800 flex items-center mb-8">
								<FaQuestion className="text-primary-500 mr-2" />
								Frequently Asked Questions
							</h2>

							<div className="space-y-4">
								{[
									{
										question: "How are donations processed?",
										answer:
											"Your donations are securely processed through our payment processor, with bank-level encryption. Recurring donations are automatically processed on your selected schedule (weekly, monthly, or annual) using your default payment method. You'll receive an email confirmation for every donation.",
									},
									{
										question: "Can I get tax deductions for my donations?",
										answer:
											"Yes! All organizations on our platform are registered 501(c)(3) organizations, making your donations tax-deductible. You can download your annual tax statement directly from your dashboard in January, or access individual receipts at any time.",
									},
									{
										question: "How do I cancel or modify a recurring donation?",
										answer:
											"You can modify or cancel any recurring donation at any time through your dashboard. Select the donation from your calendar or activity list, then click 'Edit Donation' or 'Cancel Donation.' Changes take effect immediately, and you'll receive a confirmation email.",
									},
									{
										question: "How are my donation achievements calculated?",
										answer:
											"Achievements are awarded based on various milestones in your donation journey. Some are unlocked by making a specific number of donations (e.g., your first, fifth, or tenth donation), while others are based on cumulative donation amounts (e.g., donating $100 or $500 in total). All achievements are automatically tracked and awarded in real-time.",
									},
									{
										question: "Is my payment information secure?",
										answer:
											"Absolutely. We use industry-leading encryption and never store your full credit card details on our servers. Our platform is PCI DSS compliant and undergoes regular security audits. We also offer two-factor authentication for your account security.",
									},
								].map((faq, index) => (
									<div className="faq-item" key={index}>
										<button
											className="faq-question w-full p-4 neumorphic-inset rounded-lg flex justify-between items-center hover:bg-primary-50 transition-colors"
											onClick={() =>
												setActiveFaqIndex(
													activeFaqIndex === index ? null : index
												)
											}
										>
											<span className="text-lg font-medium text-neutral-800">
												{faq.question}
											</span>
											{activeFaqIndex === index ? (
												<FaChevronUp className="text-neutral-500 transition-transform" />
											) : (
												<FaChevronDown className="text-neutral-500 transition-transform" />
											)}
										</button>
										<div
											className={`px-4 overflow-hidden transition-all duration-300 ${
												activeFaqIndex === index
													? "max-h-96 opacity-100"
													: "max-h-0 opacity-0"
											}`}
										>
											<div className="pt-2 pb-4">
												<p className="text-neutral-700">{faq.answer}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
							<div className="neumorphic-card p-6">
								<div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-8 w-8"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-medium text-neutral-800 text-center mb-2">
									Email Support
								</h3>
								<p className="text-neutral-600 text-center mb-4">
									We typically respond within 24 hours on business days.
								</p>
								<a
									href="mailto:support@donorhub.org"
									className="block text-center text-primary-600 font-medium hover:underline"
								>
									support@donorhub.org
								</a>
							</div>

							<div className="neumorphic-card p-6">
								<div className="w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mx-auto mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-8 w-8"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-medium text-neutral-800 text-center mb-2">
									Phone Support
								</h3>
								<p className="text-neutral-600 text-center mb-4">
									Available Monday-Friday, 9am-5pm EST.
								</p>
								<a
									href="tel:+18005551212"
									className="block text-center text-secondary-600 font-medium hover:underline"
								>
									1-800-555-1212
								</a>
							</div>

							<div className="neumorphic-card p-6">
								<div className="w-16 h-16 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center mx-auto mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-8 w-8"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-medium text-neutral-800 text-center mb-2">
									Live Chat
								</h3>
								<p className="text-neutral-600 text-center mb-4">
									Get immediate assistance from our support team.
								</p>
								<button className="block w-full text-center py-2 px-4 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors">
									Start Chat
								</button>
							</div>
						</div>

						<div className="neumorphic p-6 mb-10">
							<h2 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-primary-500 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
								Helpful Resources
							</h2>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{[
									{
										title: "Donor Guide",
										description:
											"Learn how to navigate the platform and maximize your impact",
										icon: "book",
									},
									{
										title: "Tax Information",
										description:
											"Understanding tax benefits of charitable giving",
										icon: "file",
									},
									{
										title: "Achievement Guide",
										description:
											"How to unlock all donor achievements and rewards",
										icon: "trophy",
									},
									{
										title: "Impact Reports",
										description:
											"Detailed reports on how donations are making a difference",
										icon: "chart",
									},
									{
										title: "Organization Profiles",
										description:
											"Learn more about the organizations you can support",
										icon: "building",
									},
									{
										title: "Community Guidelines",
										description: "Our standards for a positive donor community",
										icon: "users",
									},
								].map((resource, index) => (
									<div
										key={index}
										className="p-4 neumorphic-card hover:bg-primary-50 transition-colors"
									>
										<div className="flex items-start">
											<div className="flex-shrink-0 mt-1">
												{resource.icon === "book" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6 text-primary-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
														/>
													</svg>
												)}
												{resource.icon === "file" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6 text-secondary-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
														/>
													</svg>
												)}
												{resource.icon === "trophy" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6 text-accent-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
														/>
													</svg>
												)}
												{resource.icon === "chart" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6 text-purple-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
														/>
													</svg>
												)}
												{resource.icon === "building" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6 text-green-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
														/>
													</svg>
												)}
												{resource.icon === "users" && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6 text-indigo-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
														/>
													</svg>
												)}
											</div>
											<div className="ml-4">
												<h3 className="text-base font-medium text-neutral-800">
													{resource.title}
												</h3>
												<p className="mt-1 text-sm text-neutral-600">
													{resource.description}
												</p>
												<a
													href="#"
													className="mt-2 inline-flex items-center text-sm text-primary-600 font-medium hover:underline"
												>
													Learn more
													<svg
														className="ml-1 h-4 w-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M9 5l7 7-7 7"
														/>
													</svg>
												</a>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{activeSection === "profile" && currentUser && (
					<div className="animate-slide-up">
						<div className="neumorphic p-6 mb-8">
							<div className="flex flex-col md:flex-row items-center md:items-start gap-8">
								<div className="flex flex-col items-center">
									<div className="relative mb-4">
										<img
											src={currentUser.avatar}
											alt={currentUser.name}
											className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
										/>
										<div className="absolute -bottom-2 -right-2 bg-primary-100 text-primary-800 rounded-full px-2 py-1 text-xs font-bold shadow-md border border-white">
											Level {currentUser.level}
										</div>
									</div>
									<button className="text-sm text-primary-600 hover:underline">
										Change Photo
									</button>
								</div>

								<div className="flex-1">
									<h1 className="text-2xl font-bold text-neutral-800 mb-2 text-center md:text-left">
										{currentUser.name}
									</h1>
									<p className="text-neutral-600 mb-6 text-center md:text-left">
										Member since January 2023
									</p>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
										<div className="p-3 neumorphic-inset rounded-lg">
											<p className="text-xs text-neutral-600">Total Donated</p>
											<p className="text-lg font-semibold text-neutral-800">
												{formatCurrency(currentUser.totalDonated)}
											</p>
										</div>
										<div className="p-3 neumorphic-inset rounded-lg">
											<p className="text-xs text-neutral-600">Achievements</p>
											<p className="text-lg font-semibold text-neutral-800">
												{
													currentUser.achievements.filter((a) => a.isUnlocked)
														.length
												}{" "}
												/ {currentUser.achievements.length}
											</p>
										</div>
										<div className="p-3 neumorphic-inset rounded-lg">
											<p className="text-xs text-neutral-600">Favorite Cause</p>
											<p className="text-lg font-semibold text-neutral-800">
												{currentUser.cause}
											</p>
										</div>
									</div>

									<div className="mb-6">
										<h2 className="text-lg font-medium text-neutral-800 mb-3">
											Donation Preferences
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="p-4 neumorphic-inset rounded-lg flex items-center">
												<div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
													<FaHeart />
												</div>
												<div>
													<h3 className="text-sm font-medium text-neutral-800">
														Preferred donation type
													</h3>
													<p className="text-sm text-neutral-600">
														{currentUser.type}
													</p>
												</div>
											</div>
											<div className="p-4 neumorphic-inset rounded-lg flex items-center">
												<div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mr-3">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
														/>
													</svg>
												</div>
												<div>
													<h3 className="text-sm font-medium text-neutral-800">
														Preferred payment
													</h3>
													<p className="text-sm text-neutral-600">
														Visa ending in 4242
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className="flex flex-wrap gap-3">
										<button className="py-2 px-4 btn-gradient text-white font-medium rounded-lg">
											Edit Profile
										</button>
										<button className="py-2 px-4 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors">
											Change Password
										</button>
										<button className="py-2 px-4 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors">
											Notification Settings
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="neumorphic p-6">
								<h2 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
									<FaHeart className="text-primary-500 mr-2" />
									Recent Donations
								</h2>

								<div className="space-y-4 mb-4">
									{Array.from({ length: 3 }).map((_, index) => (
										<div
											key={index}
											className="p-3 neumorphic-inset rounded-lg flex items-center"
										>
											<div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
												<FaHeart />
											</div>
											<div className="flex-1">
												<h3 className="text-sm font-medium text-neutral-800">
													{
														[
															"Ocean Cleanup",
															"Rainforest Alliance",
															"Animal Welfare",
														][index]
													}
												</h3>
												<p className="text-xs text-neutral-600">
													{
														[
															"Monthly donation",
															"One-time donation",
															"Annual donation",
														][index]
													}
												</p>
											</div>
											<div className="text-right">
												<p className="text-sm font-semibold text-neutral-800">
													{formatCurrency([25, 50, 100][index])}
												</p>
												<p className="text-xs text-neutral-500">
													{formatDate(
														new Date(
															Date.now() - index * 7 * 24 * 60 * 60 * 1000
														)
													)}
												</p>
											</div>
										</div>
									))}
								</div>

								<button className="w-full py-2 px-4 btn-neu text-primary-600 font-medium rounded-lg flex items-center justify-center">
									<span>View All Donations</span>
									<svg
										className="h-4 w-4 ml-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>

							<div className="neumorphic p-6">
								<h2 className="text-xl font-semibold text-neutral-800 flex items-center mb-6">
									<FaTrophy className="text-primary-500 mr-2" />
									Achievement Progress
								</h2>

								<div className="space-y-4 mb-4">
									{currentUser.achievements
										.filter((a) => !a.isUnlocked)
										.slice(0, 3)
										.map((achievement, index) => (
											<div
												key={index}
												className="p-3 neumorphic-inset rounded-lg"
											>
												<div className="flex items-center mb-2">
													<div
														className="w-10 h-10 rounded-full flex items-center justify-center mr-3 opacity-50"
														style={{
															backgroundColor: `${achievement.color}20`,
															color: achievement.color,
														}}
													>
														{achievement.icon === "heart" && (
															<IoMdHeart className="text-xl" />
														)}
														{achievement.icon === "medal" && (
															<FaMedal className="text-xl" />
														)}
														{achievement.icon === "trophy" && (
															<FaTrophy className="text-xl" />
														)}
														{achievement.icon === "crown" && (
															<FaCrown className="text-xl" />
														)}
														{achievement.icon === "fire" && (
															<FaFireAlt className="text-xl" />
														)}
														{achievement.icon === "star" && (
															<FaStar className="text-xl" />
														)}
													</div>
													<div>
														<h3 className="text-sm font-medium text-neutral-800">
															{achievement.title}
														</h3>
														<p className="text-xs text-neutral-600">
															{achievement.description}
														</p>
													</div>
												</div>

												<div>
													<div className="flex justify-between items-center mb-1">
														<span className="text-xs text-neutral-600">
															Progress
														</span>
														<span className="text-xs font-medium text-neutral-700">
															{achievement.id.includes("dollars")
																? `${formatCurrency(
																		currentUser.totalDonated
																  )} / ${formatCurrency(
																		achievement.unlockedAt
																  )}`
																: `${
																		currentUser.achievements.filter(
																			(a) => a.isUnlocked
																		).length
																  } / ${achievement.unlockedAt}`}
														</span>
													</div>
													<div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
														<div
															className="h-full bg-gradient-to-r from-neutral-400 to-neutral-500"
															style={{
																width: `${
																	achievement.id.includes("dollars")
																		? Math.min(
																				100,
																				(currentUser.totalDonated /
																					achievement.unlockedAt) *
																					100
																		  )
																		: Math.min(
																				100,
																				(currentUser.achievements.filter(
																					(a) => a.isUnlocked
																				).length /
																					achievement.unlockedAt) *
																					100
																		  )
																}%`,
															}}
														></div>
													</div>
												</div>
											</div>
										))}
								</div>

								<button
									onClick={() => setActiveSection("achievements")}
									className="w-full py-2 px-4 btn-neu text-primary-600 font-medium rounded-lg flex items-center justify-center"
								>
									<span>View All Achievements</span>
									<svg
										className="h-4 w-4 ml-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				)}
			</main>

			<section className="bg-neutral-100 py-12 mt-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-xl mx-auto text-center">
						<h2 className="text-2xl font-bold text-neutral-800 mb-4">
							Stay Updated
						</h2>
						<p className="text-neutral-600 mb-6">
							Get monthly impact reports and news about our donor community.
						</p>
						<form className="flex flex-col sm:flex-row gap-3">
							<input
								type="email"
								placeholder="Your email address"
								className="neumorphic-inset py-3 px-4 flex-grow rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
							<button
								type="submit"
								className="py-3 px-6 btn-gradient text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all btn-gradient-hover"
							>
								Subscribe
							</button>
						</form>
						<p className="text-xs text-neutral-500 mt-3">
							We respect your privacy. Unsubscribe at any time.
						</p>
					</div>
				</div>
			</section>

			<footer className="bg-white pt-12 pb-6 border-t border-neutral-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
						<div className="lg:col-span-2">
							<div className="flex items-center mb-4">
								<div className="w-10 h-10 mr-3 rounded-full flex items-center justify-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
									<FaHandHoldingHeart />
								</div>
								<h1 className="text-xl font-bold brand-gradient">DonorHub</h1>
							</div>
							<p className="text-neutral-600 mb-4 max-w-md">
								Simplifying the way organizations recognize and celebrate their
								donors. Our platform makes it easy to track, visualize, and
								reward charitable giving.
							</p>
							<div className="flex space-x-4">
								<a
									href="#"
									className="w-10 h-10 rounded-full btn-neu flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-colors"
									aria-label="Social Media"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="w-10 h-10 rounded-full btn-neu flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-colors"
									aria-label="Share"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="w-10 h-10 rounded-full btn-neu flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-colors"
									aria-label="Photo Gallery"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="w-10 h-10 rounded-full btn-neu flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-colors"
									aria-label="Professional Network"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-neutral-800 mb-4">
								Quick Links
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Dashboard
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Donate Now
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Organizations
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Impact Reports
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Achievements
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-neutral-800 mb-4">
								Resources
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										FAQ
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Partners
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Testimonials
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-neutral-800 mb-4">
								Contact Us
							</h3>
							<ul className="space-y-2">
								<li className="flex items-start">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-primary-500 mt-1 mr-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span className="text-neutral-600">
										123 Impact Drive
										<br />
										San Francisco, CA 94103
									</span>
								</li>
								<li className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-primary-500 mr-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
									<span className="text-neutral-600">(555) 123-4567</span>
								</li>
								<li className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-primary-500 mr-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
									<span className="text-neutral-600">support@donorhub.org</span>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-neutral-200 pt-6 mt-8">
						<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
							<div className="text-neutral-500 text-sm">
								&copy; 2025 DonorHub. Donate easily.
							</div>
							<div className="flex flex-wrap gap-4 text-sm">
								<a
									href="#"
									className="text-neutral-500 hover:text-primary-600 transition-colors"
								>
									Privacy Policy
								</a>
								<a
									href="#"
									className="text-neutral-500 hover:text-primary-600 transition-colors"
								>
									Terms of Service
								</a>
								<a
									href="#"
									className="text-neutral-500 hover:text-primary-600 transition-colors"
								>
									Security
								</a>
								<a
									href="#"
									className="text-neutral-500 hover:text-primary-600 transition-colors"
								>
									Accessibility
								</a>
							</div>
						</div>
						<div className="mt-4 text-xs text-neutral-400 text-center">
							DonorHub is committed to transparent and ethical business
							practices that help organizations recognize and celebrate their
							donors.
						</div>
					</div>
				</div>
			</footer>

			{showAchievementModal && newAchievement && (
				<div className="fixed inset-0 bg-neutral-900 bg-opacity-60 z-50 flex items-center justify-center">
					<div className="bg-white rounded-xl max-w-md w-full mx-4 achievement-unlock-animation shadow-xl">
						<div className="p-6">
							<div className="flex flex-col items-center text-center">
								<div
									className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
									style={{
										backgroundColor: `${newAchievement.color}20`,
										color: newAchievement.color,
									}}
								>
									{newAchievement.icon === "heart" && (
										<IoMdHeart className="text-5xl" />
									)}
									{newAchievement.icon === "medal" && (
										<FaMedal className="text-5xl" />
									)}
									{newAchievement.icon === "trophy" && (
										<FaTrophy className="text-5xl" />
									)}
									{newAchievement.icon === "crown" && (
										<FaCrown className="text-5xl" />
									)}
									{newAchievement.icon === "fire" && (
										<FaFireAlt className="text-5xl" />
									)}
									{newAchievement.icon === "star" && (
										<FaStar className="text-5xl" />
									)}
								</div>

								<h2 className="text-2xl font-bold text-neutral-800 mb-2">
									Achievement Unlocked!
								</h2>
								<h3 className="text-xl font-medium text-primary-600 mb-4">
									{newAchievement.title}
								</h3>

								<p className="text-neutral-600 mb-6">
									{newAchievement.description}
								</p>

								<button
									onClick={() => setShowAchievementModal(false)}
									className="py-3 px-6 btn-gradient text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 btn-gradient-hover"
								>
									Awesome!
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{showNewDonationModal && (
				<div className="fixed inset-0 bg-neutral-900 bg-opacity-60 z-50 flex items-center justify-center">
					<div className="bg-white rounded-xl max-w-lg w-full mx-4 animate-scale shadow-xl overflow-hidden">
						{/* Step Indicator */}
						{paymentStep !== "processing" && !paymentSuccess && (
							<div className="px-6 pt-6 pb-2">
								<div className="flex items-center justify-between mb-2">
									{[
										{ key: "details", label: "Details", num: 1 },
										{ key: "payment", label: "Payment", num: 2 },
										{ key: "review", label: "Review", num: 3 },
									].map((step, idx) => {
										const steps = ["details", "payment", "review"];
										const currentIdx = steps.indexOf(paymentStep);
										const isActive = paymentStep === step.key;
										const isCompleted = currentIdx > idx;
										return (
											<React.Fragment key={step.key}>
												{idx > 0 && (
													<div
														className={`flex-1 h-0.5 mx-2 rounded ${
															isCompleted
																? "bg-gradient-to-r from-primary-500 to-secondary-500"
																: "bg-neutral-200"
														}`}
													/>
												)}
												<div className="flex flex-col items-center">
													<div
														className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
															isActive
																? "btn-gradient text-white shadow-md"
																: isCompleted
																? "bg-secondary-500 text-white"
																: "bg-neutral-200 text-neutral-500"
														}`}
													>
														{isCompleted ? (
															<FaCheckCircle className="text-sm" />
														) : (
															step.num
														)}
													</div>
													<span
														className={`text-xs mt-1 font-medium ${
															isActive
																? "text-primary-600"
																: isCompleted
																? "text-secondary-600"
																: "text-neutral-400"
														}`}
													>
														{step.label}
													</span>
												</div>
											</React.Fragment>
										);
									})}
								</div>
							</div>
						)}

						<div className="p-6 pt-3">
							{/* Header */}
							{!paymentSuccess && paymentStep !== "processing" && (
								<div className="flex items-start justify-between mb-5">
									<h3 className="text-lg font-semibold text-neutral-900 flex items-center">
										<FaHeart className="text-primary-500 mr-2" />
										{paymentStep === "details" && "Make a Donation"}
										{paymentStep === "payment" && "Payment Method"}
										{paymentStep === "review" && "Review & Confirm"}
									</h3>
									<button
										onClick={closePaymentModal}
										className="text-neutral-400 hover:text-neutral-500 btn-neu w-8 h-8 rounded-full flex items-center justify-center"
									>
										<FaTimes />
									</button>
								</div>
							)}

							{/* ───── STEP 1: Details ───── */}
							{paymentStep === "details" && (
								<div className="payment-step-enter space-y-5">
									<div>
										<label
											htmlFor="cause"
											className="block text-sm font-medium text-neutral-700 mb-1"
										>
											Select a Cause
										</label>
										<select
											id="cause"
											className="neumorphic-inset appearance-none py-3 px-4 block w-full text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
											value={selectedCause}
											onChange={(e) => setSelectedCause(e.target.value)}
										>
											{causes.map((cause) => (
												<option key={cause} value={cause}>
													{cause}
												</option>
											))}
										</select>
									</div>

									<div>
										<label
											htmlFor="donationAmount"
											className="block text-sm font-medium text-neutral-700 mb-1"
										>
											Donation Amount
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<span className="text-neutral-500">$</span>
											</div>
											<input
												type="number"
												id="donationAmount"
												className="neumorphic-inset py-3 pl-7 pr-3 block w-full text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
												placeholder="0.00"
												value={newDonationAmount}
												min="1"
												step="1"
												onChange={(e) =>
													setNewDonationAmount(Number(e.target.value))
												}
											/>
										</div>
										<div className="flex justify-between mt-2 flex-wrap gap-2">
											{[10, 25, 50, 100, 500].map((amount) => (
												<button
													key={amount}
													type="button"
													className={`p-2 text-xs font-medium rounded-lg ${
														newDonationAmount === amount
															? "bg-primary-100 text-primary-700 neumorphic-inset"
															: "btn-neu text-neutral-700"
													}`}
													onClick={() => setNewDonationAmount(amount)}
												>
													${amount}
												</button>
											))}
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-neutral-700 mb-2">
											Donation Frequency
										</label>
										<div className="grid grid-cols-3 gap-3">
											{(
												[
													{ val: "one-time", label: "One Time" },
													{ val: "monthly", label: "Monthly" },
													{ val: "annual", label: "Annual" },
												] as const
											).map((freq) => (
												<button
													key={freq.val}
													type="button"
													className={`py-3 text-center rounded-lg text-sm font-medium transition-colors ${
														donationFrequency === freq.val
															? "bg-primary-100 text-primary-700 neumorphic-inset"
															: "btn-neu text-neutral-700"
													}`}
													onClick={() => setDonationFrequency(freq.val)}
												>
													{freq.label}
												</button>
											))}
										</div>
									</div>

									<div className="flex justify-end gap-3 pt-2">
										<button
											type="button"
											onClick={closePaymentModal}
											className="py-3 px-6 btn-neu rounded-lg text-neutral-700 hover:bg-neutral-50"
										>
											Cancel
										</button>
										<button
											type="button"
											onClick={() => setPaymentStep("payment")}
											className="py-3 px-6 btn-gradient text-white rounded-lg shadow-md hover:shadow-lg"
										>
											Continue to Payment →
										</button>
									</div>
								</div>
							)}

							{/* ───── STEP 2: Payment Method ───── */}
							{paymentStep === "payment" && (
								<div className="payment-step-enter space-y-5">
									{/* Saved Card */}
									<div>
										<label className="block text-sm font-medium text-neutral-700 mb-2">
											Saved Payment Methods
										</label>
										<button
											type="button"
											onClick={() => setSelectedPaymentMethod("saved-visa")}
											className={`w-full p-4 rounded-lg flex items-center transition-all ${
												selectedPaymentMethod === "saved-visa"
													? "neumorphic-inset border-2 border-primary-400"
													: "btn-neu"
											}`}
										>
											<div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center mr-3">
												<span className="text-white text-xs font-bold">
													VISA
												</span>
											</div>
											<div className="text-left">
												<p className="text-sm font-medium text-neutral-700">
													Visa •••• 4242
												</p>
												<p className="text-xs text-neutral-500">
													Expires 12/27
												</p>
											</div>
											{selectedPaymentMethod === "saved-visa" && (
												<FaCheckCircle className="ml-auto text-primary-500" />
											)}
										</button>
									</div>

									{/* New Card */}
									<div>
										<button
											type="button"
											onClick={() => setSelectedPaymentMethod("new-card")}
											className={`w-full p-4 rounded-lg flex items-center transition-all mb-3 ${
												selectedPaymentMethod === "new-card"
													? "neumorphic-inset border-2 border-primary-400"
													: "btn-neu"
											}`}
										>
											<div className="w-10 h-7 bg-neutral-200 rounded flex items-center justify-center mr-3">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4 text-neutral-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 4v16m8-8H4"
													/>
												</svg>
											</div>
											<p className="text-sm font-medium text-neutral-700">
												New Credit/Debit Card
											</p>
											{selectedPaymentMethod === "new-card" && (
												<FaCheckCircle className="ml-auto text-primary-500" />
											)}
										</button>

										{selectedPaymentMethod === "new-card" && (
											<div className="space-y-3 pl-2 pr-2 payment-step-enter">
												<div>
													<label className="block text-xs font-medium text-neutral-600 mb-1">
														Card Number
													</label>
													<input
														type="text"
														placeholder="1234 5678 9012 3456"
														maxLength={19}
														className="neumorphic-inset py-2.5 px-4 block w-full text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg text-sm"
														value={cardDetails.number}
														onChange={(e) =>
															setCardDetails({
																...cardDetails,
																number: formatCardNumber(e.target.value),
															})
														}
													/>
												</div>
												<div>
													<label className="block text-xs font-medium text-neutral-600 mb-1">
														Name on Card
													</label>
													<input
														type="text"
														placeholder="John Doe"
														className="neumorphic-inset py-2.5 px-4 block w-full text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg text-sm"
														value={cardDetails.name}
														onChange={(e) =>
															setCardDetails({
																...cardDetails,
																name: e.target.value,
															})
														}
													/>
												</div>
												<div className="grid grid-cols-2 gap-3">
													<div>
														<label className="block text-xs font-medium text-neutral-600 mb-1">
															Expiry
														</label>
														<input
															type="text"
															placeholder="MM/YY"
															maxLength={5}
															className="neumorphic-inset py-2.5 px-4 block w-full text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg text-sm"
															value={cardDetails.expiry}
															onChange={(e) =>
																setCardDetails({
																	...cardDetails,
																	expiry: formatExpiry(e.target.value),
																})
															}
														/>
													</div>
													<div>
														<label className="block text-xs font-medium text-neutral-600 mb-1">
															CVV
														</label>
														<input
															type="password"
															placeholder="•••"
															maxLength={4}
															className="neumorphic-inset py-2.5 px-4 block w-full text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg text-sm"
															value={cardDetails.cvv}
															onChange={(e) =>
																setCardDetails({
																	...cardDetails,
																	cvv: e.target.value.replace(/\D/g, ""),
																})
															}
														/>
													</div>
												</div>
											</div>
										)}
									</div>

									{/* Alternative Methods */}
									<div>
										<label className="block text-sm font-medium text-neutral-700 mb-2">
											Other Payment Options
										</label>
										<div className="grid grid-cols-2 gap-3">
											<button
												type="button"
												onClick={() => setSelectedPaymentMethod("paypal")}
												className={`p-3 rounded-lg flex items-center justify-center transition-all ${
													selectedPaymentMethod === "paypal"
														? "neumorphic-inset border-2 border-primary-400"
														: "btn-neu"
												}`}
											>
												<span className="text-sm font-bold text-blue-600">
													Pay
												</span>
												<span className="text-sm font-bold text-blue-800">
													Pal
												</span>
											</button>
											<button
												type="button"
												onClick={() => setSelectedPaymentMethod("apple-pay")}
												className={`p-3 rounded-lg flex items-center justify-center transition-all ${
													selectedPaymentMethod === "apple-pay"
														? "neumorphic-inset border-2 border-primary-400"
														: "btn-neu"
												}`}
											>
												<span className="text-sm font-medium text-neutral-800">
													Pay
												</span>
											</button>
										</div>
									</div>

									<div className="flex items-center pt-1">
										<FaLock className="text-neutral-400 mr-2 text-xs" />
										<span className="text-xs text-neutral-500">
											256-bit SSL encrypted payment
										</span>
									</div>

									<div className="flex justify-between gap-3 pt-2">
										<button
											type="button"
											onClick={() => setPaymentStep("details")}
											className="py-3 px-6 btn-neu rounded-lg text-neutral-700 hover:bg-neutral-50"
										>
											← Back
										</button>
										<button
											type="button"
											onClick={() => setPaymentStep("review")}
											className="py-3 px-6 btn-gradient text-white rounded-lg shadow-md hover:shadow-lg"
										>
											Review Order →
										</button>
									</div>
								</div>
							)}

							{/* ───── STEP 3: Review ───── */}
							{paymentStep === "review" && (
								<div className="payment-step-enter space-y-5">
									<div className="neumorphic-inset rounded-lg p-5">
										<h4 className="text-sm font-semibold text-neutral-800 mb-4 flex items-center">
											<FaHandHoldingHeart className="text-primary-500 mr-2" />
											Donation Summary
										</h4>
										<div className="space-y-3">
											<div className="flex justify-between items-center">
												<span className="text-sm text-neutral-600">Cause</span>
												<span className="text-sm font-medium text-neutral-800">
													{selectedCause}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-sm text-neutral-600">
													Frequency
												</span>
												<span className="text-sm font-medium text-neutral-800 capitalize">
													{donationFrequency}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-sm text-neutral-600">
													Payment Method
												</span>
												<span className="text-sm font-medium text-neutral-800">
													{getPaymentMethodLabel()}
												</span>
											</div>
											<div className="border-t border-neutral-200 pt-3 mt-3">
												<div className="flex justify-between items-center">
													<span className="text-base font-semibold text-neutral-800">
														Total
													</span>
													<span className="text-2xl font-bold brand-gradient">
														${newDonationAmount}
													</span>
												</div>
											</div>
										</div>
									</div>

									{/* Impact Preview */}
									<div className="p-4 bg-primary-50 rounded-lg border-l-4 border-primary-500">
										<h4 className="text-sm font-medium text-primary-800 mb-1">
											Your Impact
										</h4>
										<p className="text-sm text-primary-700">
											{selectedCause === "Ocean Cleanup" &&
												`Your donation will help remove approximately ${(
													newDonationAmount * 0.1
												).toFixed(1)} pounds of plastic from our oceans.`}
											{selectedCause === "Rainforest Preservation" &&
												`Your donation will help preserve approximately ${(
													newDonationAmount / 120
												).toFixed(2)} acres of rainforest.`}
											{selectedCause === "Children's Education" &&
												`Your donation will provide educational materials for ${Math.floor(
													newDonationAmount / 20
												)} children.`}
											{selectedCause === "Animal Welfare" &&
												`Your donation will provide care for ${Math.floor(
													newDonationAmount / 10
												)} shelter animals for a week.`}
											{selectedCause === "Local Food Bank" &&
												`Your donation will provide approximately ${Math.floor(
													newDonationAmount * 0.66
												)} meals to those in need.`}
											{selectedCause === "Climate Action" &&
												`Your donation will offset approximately ${(
													newDonationAmount * 0.5
												).toFixed(1)} tons of carbon emissions.`}
											{selectedCause === "Medical Research" &&
												`Your donation will support ${Math.floor(
													newDonationAmount / 50
												)} hours of critical medical research.`}
											{selectedCause === "Digital Literacy" &&
												`Your donation will provide ${Math.floor(
													newDonationAmount / 30
												)} hours of digital literacy training.`}
										</p>
									</div>

									<div className="flex items-center">
										<FaLock className="text-secondary-500 mr-2 text-xs" />
										<span className="text-xs text-neutral-500">
											Your payment information is secure and encrypted
										</span>
									</div>

									<div className="flex justify-between gap-3 pt-2">
										<button
											type="button"
											onClick={() => setPaymentStep("payment")}
											className="py-3 px-6 btn-neu rounded-lg text-neutral-700 hover:bg-neutral-50"
										>
											← Back
										</button>
										<button
											type="button"
											onClick={startProcessing}
											className="py-3 px-6 btn-gradient text-white rounded-lg shadow-md hover:shadow-lg flex items-center"
										>
											<FaLock className="mr-2 text-xs" />
											Confirm & Pay ${newDonationAmount}
										</button>
									</div>
								</div>
							)}

							{/* ───── STEP 4: Processing ───── */}
							{paymentStep === "processing" && !paymentSuccess && (
								<div className="payment-step-enter text-center py-8">
									<div className="w-20 h-20 mx-auto mb-6 rounded-full btn-gradient flex items-center justify-center processing-pulse">
										<FaHandHoldingHeart className="text-white text-3xl" />
									</div>
									<h3 className="text-xl font-semibold text-neutral-800 mb-2">
										Processing Your Donation
									</h3>
									<p className="text-sm text-neutral-500 mb-6">
										Please wait while we securely process your payment...
									</p>
									<div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden mx-auto max-w-xs">
										<div
											className="h-full rounded-full btn-gradient transition-all duration-200 ease-out"
											style={{
												width: `${processingProgress}%`,
											}}
										/>
									</div>
									<p className="text-xs text-neutral-400 mt-3">
										{Math.round(processingProgress)}% complete
									</p>
								</div>
							)}

							{/* ───── STEP 4: Success ───── */}
							{paymentSuccess && (
								<div className="text-center py-4 relative overflow-hidden">
									{/* Confetti */}
									<div className="absolute inset-0 pointer-events-none overflow-hidden">
										{Array.from({ length: 20 }, (_, i) => (
											<div
												key={i}
												className="absolute confetti-piece"
												style={{
													left: `${Math.random() * 100}%`,
													top: "-20px",
													width: `${Math.random() * 8 + 4}px`,
													height: `${Math.random() * 8 + 4}px`,
													backgroundColor: [
														"#0ea5e9",
														"#10b981",
														"#f97316",
														"#8b5cf6",
														"#ec4899",
														"#eab308",
													][i % 6],
													borderRadius: Math.random() > 0.5 ? "50%" : "2px",
													animationDelay: `${Math.random() * 1.5}s`,
													animationDuration: `${2 + Math.random() * 2}s`,
												}}
											/>
										))}
									</div>

									<div className="w-20 h-20 mx-auto mb-5 rounded-full bg-secondary-100 flex items-center justify-center success-pop">
										<FaCheckCircle className="text-secondary-500 text-4xl" />
									</div>

									<h3
										className="text-xl font-bold text-neutral-800 mb-1 success-pop"
										style={{ animationDelay: "0.2s" }}
									>
										Donation Successful!
									</h3>
									<p className="text-sm text-neutral-500 mb-6">
										Thank you for your generous contribution
									</p>

									<div className="neumorphic-inset rounded-lg p-5 text-left mb-6 mx-auto max-w-sm">
										<h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
											Receipt
										</h4>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-xs text-neutral-500">
													Receipt ID
												</span>
												<span className="text-xs font-mono font-medium text-neutral-700">
													{receiptId}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-xs text-neutral-500">Cause</span>
												<span className="text-xs font-medium text-neutral-700">
													{selectedCause}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-xs text-neutral-500">Amount</span>
												<span className="text-xs font-medium text-neutral-700">
													${newDonationAmount}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-xs text-neutral-500">
													Frequency
												</span>
												<span className="text-xs font-medium text-neutral-700 capitalize">
													{donationFrequency}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-xs text-neutral-500">
													Payment
												</span>
												<span className="text-xs font-medium text-neutral-700">
													{getPaymentMethodLabel()}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-xs text-neutral-500">Date</span>
												<span className="text-xs font-medium text-neutral-700">
													{new Date().toLocaleDateString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
													})}
												</span>
											</div>
										</div>
									</div>

									<div className="flex flex-col sm:flex-row gap-3 justify-center">
										<button
											type="button"
											onClick={() => {
												const doc = new jsPDF();
												const pageWidth = doc.internal.pageSize.getWidth();

												// Header gradient bar
												doc.setFillColor(14, 165, 233);
												doc.rect(0, 0, pageWidth, 40, "F");
												doc.setFillColor(16, 185, 129);
												doc.rect(pageWidth / 2, 0, pageWidth / 2, 40, "F");

												// Branding
												doc.setFont("helvetica", "bold");
												doc.setFontSize(24);
												doc.setTextColor(255, 255, 255);
												doc.text("DonorHub", 20, 22);
												doc.setFontSize(10);
												doc.setFont("helvetica", "normal");
												doc.text("Donation Receipt", 20, 32);

												// Receipt ID on right
												doc.setFontSize(9);
												doc.text(`Receipt #${receiptId}`, pageWidth - 20, 22, {
													align: "right",
												});
												doc.text(
													new Date().toLocaleDateString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
													}),
													pageWidth - 20,
													32,
													{ align: "right" }
												);

												// Thank you message
												let y = 60;
												doc.setTextColor(30, 41, 59);
												doc.setFont("helvetica", "bold");
												doc.setFontSize(18);
												doc.text("Thank you for your donation!", 20, y);

												y += 10;
												doc.setFont("helvetica", "normal");
												doc.setFontSize(10);
												doc.setTextColor(100, 116, 139);
												doc.text(
													"Your generous contribution makes a real difference. Below is your official receipt.",
													20,
													y
												);

												// Divider
												y += 12;
												doc.setDrawColor(226, 232, 240);
												doc.setLineWidth(0.5);
												doc.line(20, y, pageWidth - 20, y);

												// Donation details table
												y += 12;
												doc.setFont("helvetica", "bold");
												doc.setFontSize(12);
												doc.setTextColor(30, 41, 59);
												doc.text("Donation Details", 20, y);

												y += 10;
												const details = [
													["Cause", selectedCause],
													["Amount", `$${newDonationAmount}.00`],
													[
														"Frequency",
														donationFrequency.charAt(0).toUpperCase() +
															donationFrequency.slice(1),
													],
													["Payment Method", getPaymentMethodLabel()],
													[
														"Transaction Date",
														new Date().toLocaleDateString("en-US", {
															month: "long",
															day: "numeric",
															year: "numeric",
														}),
													],
													["Receipt ID", receiptId],
												];

												details.forEach(([label, value], idx) => {
													// Alternating row background
													if (idx % 2 === 0) {
														doc.setFillColor(248, 250, 252);
														doc.rect(20, y - 5, pageWidth - 40, 12, "F");
													}

													doc.setFont("helvetica", "normal");
													doc.setFontSize(10);
													doc.setTextColor(100, 116, 139);
													doc.text(label, 25, y + 2);

													doc.setFont("helvetica", "bold");
													doc.setTextColor(30, 41, 59);
													doc.text(value, pageWidth - 25, y + 2, {
														align: "right",
													});

													y += 12;
												});

												// Amount highlight box
												y += 5;
												doc.setFillColor(240, 249, 255);
												doc.roundedRect(
													20,
													y - 2,
													pageWidth - 40,
													30,
													4,
													4,
													"F"
												);
												doc.setFillColor(14, 165, 233);
												doc.rect(20, y - 2, 4, 30, "F");

												doc.setFont("helvetica", "normal");
												doc.setFontSize(10);
												doc.setTextColor(7, 89, 133);
												doc.text("Total Donation Amount", 30, y + 10);
												doc.setFont("helvetica", "bold");
												doc.setFontSize(20);
												doc.setTextColor(14, 165, 233);
												doc.text(`$${newDonationAmount}.00`, 30, y + 22);

												// Footer divider
												y += 45;
												doc.setDrawColor(226, 232, 240);
												doc.line(20, y, pageWidth - 20, y);

												// Footer
												y += 10;
												doc.setFont("helvetica", "normal");
												doc.setFontSize(8);
												doc.setTextColor(148, 163, 184);
												doc.text(
													"This receipt is generated by DonorHub. Please retain this for your records.",
													pageWidth / 2,
													y,
													{ align: "center" }
												);
												y += 5;
												doc.text(
													"Donations may be tax-deductible. Consult your tax advisor for guidance.",
													pageWidth / 2,
													y,
													{ align: "center" }
												);

												doc.save(`DonorHub-Receipt-${receiptId}.pdf`);
											}}
											className="py-2.5 px-5 btn-neu rounded-lg text-neutral-700 hover:bg-neutral-50 flex items-center justify-center text-sm"
										>
											<FaDownload className="mr-2" />
											Download Receipt
										</button>
										<button
											type="button"
											onClick={() => {
												resetPaymentFlow();
											}}
											className="py-2.5 px-5 btn-gradient text-white rounded-lg shadow-md hover:shadow-lg text-sm"
										>
											Make Another Donation
										</button>
									</div>

									<button
										type="button"
										onClick={closePaymentModal}
										className="mt-4 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
									>
										Close
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{confirmationMessage && (
				<div className="fixed bottom-5 right-5 z-50 animate-slide-up">
					<div className="bg-white rounded-lg shadow-xl p-4 max-w-md neumorphic-card">
						<div className="flex items-center">
							<div className="flex-shrink-0 mr-3">
								<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
									<FaCheckCircle className="text-green-500 text-xl" />
								</div>
							</div>
							<div>
								<p className="text-neutral-800 font-medium">
									{confirmationMessage}
								</p>
							</div>
							<button
								onClick={() => setConfirmationMessage(null)}
								className="ml-auto text-neutral-400 hover:text-neutral-500"
							>
								<FaTimes />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default DonorList;
