import KitchenBoard from "@/components/staff/KitchenBoard";

export default function StaffPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Kitchen Board</h1>
                <p className="text-slate-500">Manage incoming and active orders in real-time.</p>
            </div>

            <KitchenBoard />
        </div>
    );
}
