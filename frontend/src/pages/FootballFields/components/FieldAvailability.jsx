import Button from "../../../components/Button";

export default function FieldAvailability({ form, setForm }) {
    const toggleClosedDay = (day) => {
        const set = new Set(form.closedDays || []);
        if (set.has(day)) set.delete(day);
        else set.add(day);
        setForm({ closedDays: Array.from(set) });
    };

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Availability</h3>

            <div className="flex gap-3 items-center">
                <div className="flex-1">
                    <label className="block mb-1">Open Time</label>
                    <input type="time" step="1800" // 30 minutes = 1800 seconds
                        value={form.openTime}
                        onChange={(e) => setForm({ openTime: e.target.value })}
                        className="p-2 rounded-lg border w-full cursor-pointer" />
                </div>
                <div className="flex-1">
                    <label className="block mb-1">Close Time</label>
                    <input type="time"
                        value={form.closeTime}
                        onChange={(e) => setForm({ closeTime: e.target.value })}
                        className="p-2 rounded-lg border w-full cursor-pointer" />
                </div>
            </div>

            <div className="mt-3">
                <label className="block mb-1">Closed Days</label>
                <div className="flex flex-wrap gap-2">
                    {days.map((d) => (
                        <Button key={d} type="button" onClick={() => toggleClosedDay(d)} className={`px-3 py-1 rounded-full border ${form.closedDays?.includes(d) ? "bg-green-600 text-white" : ""}`}>
                            {d.slice(0, 3)}
                        </Button>
                    ))}
                </div>
            </div>
        </section>
    );
}
