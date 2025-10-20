import { useState } from "react";
import Button from "../../../components/Button";

export default function FieldPartnerships({ partnerships = [], setPartnerships }) {
    const [local, setLocal] = useState({ name: "", type: "cafe", description: "" });

    const add = () => {
        if (!local.name) return;
        const next = [...partnerships, local];
        setPartnerships(next);
        setLocal({ name: "", type: "cafe", description: "" });
    };

    const remove = (i) => setPartnerships(partnerships.filter((_, idx) => idx !== i));

    return (
        <section className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Partnerships</h3>

            <div className="grid gap-2">
                <input placeholder="Partner name" value={local.name} onChange={(e) => setLocal((s) => ({ ...s, name: e.target.value }))} className="p-2 rounded-lg border" />
                <select value={local.type} onChange={(e) => setLocal((s) => ({ ...s, type: e.target.value }))} className="p-2 rounded-lg border">
                    <option value="cafe">Cafe</option>
                    <option value="gym">Gym</option>
                    <option value="shop">Shop</option>
                    <option value="other">Other</option>
                </select>
                <input placeholder="Short description" value={local.description} onChange={(e) => setLocal((s) => ({ ...s, description: e.target.value }))} className="p-2 rounded-lg border" />
                <div className="flex gap-2">
                    <Button type="button" onClick={add} className="px-4 py-2 rounded bg-green-600 text-white">Add</Button>
                </div>

                <div className="space-y-2 mt-2">
                    {partnerships.map((p, i) => (
                        <div key={i} className="flex justify-between items-center border rounded p-2">
                            <div>
                                <div className="font-semibold">{p.name} <span className="text-sm opacity-70">({p.type})</span></div>
                                <div className="text-sm opacity-80">{p.description}</div>
                            </div>
                            <Button onClick={() => remove(i)} className="text-red-500">Remove</Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
