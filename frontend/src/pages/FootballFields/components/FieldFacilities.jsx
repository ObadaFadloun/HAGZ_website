export default function FieldFacilities({ form, setForm }) {
    return (
        <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Facilities</h3>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { key: "bathrooms", label: "Bathrooms" },
                    { key: "changingRooms", label: "Changing Rooms" },
                    { key: "nightLights", label: "Night Lights" },
                    { key: "parking", label: "Parking" },
                ].map((f) => (
                    <label key={f.key} className="flex items-center gap-2">
                        <input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm({ [f.key]: e.target.checked })} className="w-5 h-5 cursor-pointer" />
                        <span>{f.label}</span>
                    </label>
                ))}
            </div>

            <div className="mt-3">
                <label className="block mb-1">Capacity</label>
                <input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ capacity: Number(e.target.value) })} className="p-2 rounded-lg border w-full cursor-pointer" />
            </div>
        </section>
    );
}
