import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export const SupportView = () => {
    const supportOptions = [
        {
            title: 'WhatsApp Support',
            description: 'Chat with us on WhatsApp: +91 9693794089',
            icon: 'logos:whatsapp-icon',
            link: 'https://wa.me/919693794089',
            color: 'bg-emerald-50 dark:bg-emerald-900/30',
            textColor: 'text-emerald-600 dark:text-emerald-400',
            borderColor: 'border-emerald-100 dark:border-emerald-800',
            label: 'Open WhatsApp'
        },
        {
            title: 'Email Support',
            description: 'Send us an email: hello.bestforeveryone@gmail.com',
            icon: 'solar:letter-bold-duotone',
            link: 'mailto:hello.bestforeveryone@gmail.com',
            color: 'bg-blue-50 dark:bg-blue-900/30',
            textColor: 'text-blue-600 dark:text-blue-400',
            borderColor: 'border-blue-100 dark:border-blue-800',
            label: 'Send Email'
        },
        {
            title: 'Technical Support',
            description: 'Report technical bugs or platform issues.',
            icon: 'solar:settings-bold-duotone',
            link: 'https://t.me/bestforeveryone_support',
            color: 'bg-purple-50 dark:bg-purple-900/30',
            textColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-purple-100 dark:border-purple-800',
            label: 'Contact Tech'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Contact Support</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-lg">
                    Need help? Our dedicated support team is here to assist you with any questions or issues you may have.
                </p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {supportOptions.map((option, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className={`group relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 ${option.borderColor} transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 hover:-translate-y-1`}
                    >
                        <div className={`h-16 w-16 ${option.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                            <Icon icon={option.icon} className="text-3xl" />
                        </div>

                        <div className="space-y-2 mb-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{option.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                {option.description}
                            </p>
                        </div>

                        <a
                            href={option.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 ${option.textColor} font-bold text-sm tracking-tight hover:underline`}
                        >
                            {option.label}
                            <Icon icon="solar:arrow-right-linear" />
                        </a>

                        {/* Background Decoration */}
                        <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${option.color} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Help Center / FAQ */}
            <div className="bg-gray-900 dark:bg-white/5 dark:border dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-gray-200 dark:shadow-none">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="max-w-md">
                        <h2 className="text-3xl font-bold mb-4">Check our Plan & FAQs</h2>
                        <p className="text-gray-400 font-medium">
                            Most common questions are already answered in our detailed business plan and terms of service.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/terms'}
                        className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold shadow-lg hover:bg-gray-100 transition-all flex items-center gap-3 click-scale whitespace-nowrap"
                    >
                        <Icon icon="solar:document-text-bold" className="text-xl" />
                        Read Business Plan
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -ml-24 -mb-24" />
            </div>

            {/* Support Message */}
            <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 italic text-sm text-gray-500 dark:text-gray-400 text-center">
                Our average response time is less than 2 hours during business hours (9 AM - 6 PM IST).
            </div>
        </div>
    );
};
