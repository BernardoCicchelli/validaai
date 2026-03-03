import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Target,
    Map,
    Zap,
    LightbulbOff,
    ShieldAlert,
    HelpCircle,
    TrendingDown,
    RefreshCcw
} from 'lucide-react';
import type { ValidAIResponse, ConfidenceLevel, EvaluationDetail } from '@/types/api';
import { cn } from '@/lib/utils';

interface ResultDashboardProps {
    data: ValidAIResponse;
    onReset: () => void;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
};

const getConfidenceBadge = (confidence: ConfidenceLevel) => {
    const styles = {
        low: 'bg-destructive/10 text-destructive border-destructive/20',
        medium: 'bg-warning/10 text-warning border-warning/20',
        high: 'bg-success/10 text-success border-success/20',
    };

    return (
        <div className={cn("px-3 py-1 rounded-full text-xs font-medium border uppercase tracking-wider", styles[confidence])}>
            {confidence} Confidence
        </div>
    );
};

function EvaluationCard({
    title,
    icon: Icon,
    detail,
    delay
}: {
    title: string;
    icon: React.ElementType;
    detail: EvaluationDetail;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="glass-card p-6 flex flex-col h-full"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary font-medium">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    {title}
                </div>
                <div className={cn("text-lg font-semibold", getScoreColor(detail.score))}>
                    {detail.score}/100
                </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                {detail.reasoning}
            </p>
        </motion.div>
    );
}

export function ResultDashboard({ data, onReset }: ResultDashboardProps) {
    const hasHighRisk = data.strategic_risks.length > 2 || data.score < 40;
    const hasWeakDifferentiation = data.differentiation.score < 50;
    const hasHighSaturation = data.market_saturation.score < 50; // Inverted logic conceptually, assuming lower score here means worse (too saturated)

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border">
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold tracking-tight">Diagnostic Complete</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        {getConfidenceBadge(data.confidence)}
                        {hasHighRisk && (
                            <span className="flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20">
                                <ShieldAlert className="w-3 h-3" /> High Risk
                            </span>
                        )}
                        {hasWeakDifferentiation && (
                            <span className="flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
                                <Target className="w-3 h-3" /> Weak Differentiation
                            </span>
                        )}
                        {hasHighSaturation && (
                            <span className="flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
                                <TrendingDown className="w-3 h-3" /> High Saturation
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Overall Viability</div>
                        <div className={cn("text-6xl font-bold tracking-tighter", getScoreColor(data.score))}>
                            {data.score}
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EvaluationCard
                    title="Problem Clarity"
                    icon={HelpCircle}
                    detail={data.problem_clarity}
                    delay={0.1}
                />
                <EvaluationCard
                    title="ICP Definition"
                    icon={Target}
                    detail={data.icp_definition}
                    delay={0.2}
                />
                <EvaluationCard
                    title="Market Saturation"
                    icon={Map}
                    detail={data.market_saturation}
                    delay={0.3}
                />
                <EvaluationCard
                    title="Differentiation"
                    icon={Zap}
                    detail={data.differentiation}
                    delay={0.4}
                />
            </div>

            {/* Risks & Blind Spots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-2 text-primary font-medium text-lg">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        Strategic Risks
                    </div>
                    <ul className="space-y-3">
                        {data.strategic_risks.map((risk, i) => (
                            <li key={i} className="flex gap-3 text-sm text-muted-foreground p-3 rounded-xl bg-warning/5 border border-warning/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                                {risk}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-2 text-primary font-medium text-lg">
                        <LightbulbOff className="w-5 h-5 text-muted-foreground" />
                        Blind Spots
                    </div>
                    <ul className="space-y-3">
                        {data.blind_spots.map((spot, i) => (
                            <li key={i} className="flex gap-3 text-sm text-muted-foreground p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                                {spot}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            <div className="pt-12 pb-8 flex justify-center">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Test another idea
                </button>
            </div>
        </div>
    );
}
