import Button from "../../../components/Button";

export default function FieldExtras({ form, setForm }) {
    const toggleTag = (tag) => {
        const set = new Set(form.tags || []);
        if (set.has(tag)) set.delete(tag);
        else set.add(tag);
        setForm({ tags: Array.from(set) });
    };

    const tags = ["Kids-friendly", "Professional", "Turf", "Grass", "Indoor", "Outdoor", "5-a-side", "7-a-side", "11-a-side"];

    return (
        <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Extras</h3>

            <div className="mb-3">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.weatherIntegration} onChange={(e) => setForm({ weatherIntegration: e.target.checked })} className="cursor-pointer" />
                    <span>Enable weather integration</span>
                </label>
            </div>

            <div>
                <label className="block mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                        <Button key={t} type="button" onClick={() => toggleTag(t)} className={`px-3 py-1 rounded-full border ${form.tags?.includes(t) ? "bg-green-600 text-white" : ""}`}>
                            {t}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="mt-3">
                <label className="block mb-1">Video URL (optional)</label>
                <input type="url" value={form.video || ""} onChange={(e) => setForm({ video: e.target.value })} placeholder="https://youtube.com/..." className="p-2 rounded-lg border w-full" />
            </div>
        </section>
    );
}
