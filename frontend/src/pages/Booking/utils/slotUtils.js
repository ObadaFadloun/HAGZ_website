export function parseHour(t) {
  if (!t || typeof t !== "string") return 8;
  const [hh] = t.split(":");
  const num = Number(hh);
  return isNaN(num) ? 8 : num;
}

export function generateSlots(field, selectedDate, bookedSlots) {
  if (!field) return [];
  const open = parseHour(field?.openTime || "08:00");
  const close = parseHour(field?.closeTime || "22:00");
  const arr = [];
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  for (let h = open; h < close; h++) {
    const start = `${String(h).padStart(2, "0")}:00`;
    const end = `${String(h + 1).padStart(2, "0")}:00`;
    const slotId = `${selectedDate}-${h}`;

    const slotDateObj = new Date(selectedDate);
    const todayMidnight = new Date(now.toDateString());
    const isPastDay = slotDateObj < todayMidnight;
    const isSelectedToday = selectedDate === todayStr;
    const isPastHour = isSelectedToday && h <= now.getHours();

    const isBooked = bookedSlots.find((r) => {
      const rDate = new Date(r.date).toISOString().slice(0, 10);
      return rDate === selectedDate && r.startTime?.slice(0, 5) === start;
    });

    arr.push({
      id: slotId,
      label: `${start} - ${end}`,
      price: field?.pricing || 0,
      playerId: isBooked?.player?._id || null,
      status: isBooked?.status || null,
      available: !(isPastDay || isPastHour || !!isBooked),
    });
  }

  return arr;
}
