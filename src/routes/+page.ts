import type { PageLoad } from './$types';
import Papa from 'papaparse';

interface DailyRecord {
	date: string;
	steps: number;
}

interface Participant {
	name: string;
	totalSteps: number;
	avgDaily: number;
	daily: DailyRecord[];
	maxStreak: number;
	display?: string;
}

function computeStreak(daily: DailyRecord[]): number {
	let maxStreak = 0;
	let current = 0;
	for (const d of daily) {
		if (d.steps >= 10000) {
			current++;
		} else {
			maxStreak = Math.max(maxStreak, current);
			current = 0;
		}
	}
	return Math.max(maxStreak, current);
}

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/steps.csv');
	if (!res.ok) throw new Error('Failed to fetch steps.csv: ' + res.status);
	const text = await res.text();

	// Parse with headers
	const { data: rows } = Papa.parse<Record<string, string>>(text, {
		header: true,
		skipEmptyLines: true
	});

	// Map each row into a Participant
	const participants: Participant[] = rows.map((row) => {
		const name = (row['Name'] || '').trim();
		const totalSteps = Number(row['Total Steps'] || '0');
		const avgDaily = Number(row['Avg Daily Steps'] || '0');

		// Grab any column whose header ends with YYYY-MM-DD
		const daily: DailyRecord[] = Object.entries(row)
			.filter(([key]) => /\d{4}-\d{2}-\d{2}$/.test(key))
			.map(([key, value]) => {
				const dateMatch = key.match(/(\d{4}-\d{2}-\d{2})$/)!;
				const raw = value === 'N.A' ? '0' : value;
				return { date: dateMatch[1], steps: Number(raw) };
			});

		// initialize maxStreak; we’ll overwrite it below
		return { name, totalSteps, avgDaily, daily, maxStreak: 0 };
	});

	// Fill in missing and future days up to the 84-day challenge window
	const challengeStart = new Date('2025-04-10');
	const msPerDay = 1000 * 60 * 60 * 24;
	const dateList = Array.from({ length: 84 }, (_, i) => {
		const d = new Date(challengeStart.getTime() + i * msPerDay);
		return d.toISOString().slice(0, 10);
	});
	participants.forEach((p) => {
		const mapByDate: Record<string, number> = {};
		p.daily.forEach((d) => (mapByDate[d.date] = d.steps));
		p.daily = dateList.map((date) => ({ date, steps: mapByDate[date] ?? 0 }));
	});

	// Correct step counts for Benjamin Hoefling
	{
		const corrections: Record<string, number> = {
			'2025-04-29': 18555,
			'2025-04-28': 14662,
			'2025-04-27': 12601
		};
		const ben = participants.find((p) => p.name === 'Benjamin Hoefling');
		if (ben) {
			ben.daily = ben.daily.map((d) => ({
				date: d.date,
				steps: corrections[d.date] ?? d.steps
			}));
		}
	}

	// Correct step count for Batsi Ziki
	{
		const correctionsBZ: Record<string, number> = {
			'2025-05-25': 13189
		};
		const batsi = participants.find((p) => p.name === 'Batsi Ziki');
		if (batsi) {
			batsi.daily = batsi.daily.map((d) => ({
				date: d.date,
				steps: correctionsBZ[d.date] ?? d.steps
			}));
		}
	}

	// Compute max streaks
	participants.forEach((p) => {
		p.maxStreak = computeStreak(p.daily);
	});

	// Sort by longest streak, then by total steps
	participants.sort((a, b) => b.maxStreak - a.maxStreak || b.totalSteps - a.totalSteps);

	// Disambiguate first names
	const groups = new Map<string, Participant[]>();
	for (const p of participants) {
		const first = p.name.split(' ')[0];
		(groups.get(first) || groups.set(first, []).get(first)!).push(p);
	}
	for (const [first, group] of groups) {
		if (group.length === 1) {
			group[0].display = first;
		} else {
			for (const p of group) {
				for (let len = first.length + 1; len <= p.name.length; len++) {
					const cand = p.name.slice(0, len);
					if (group.every((o) => o === p || !o.name.startsWith(cand))) {
						p.display = cand;
						break;
					}
				}
			}
		}
	}

	// Top 5 big days across everyone
	const allDays = participants.flatMap((p) => p.daily.map((d) => ({ name: p.display!, ...d })));
	const top5 = allDays.sort((a, b) => b.steps - a.steps).slice(0, 5);

	// Progress: days since 2025-04-10, capped at 84
	const startDate = new Date('2025-04-10');
	const today = new Date();
	const diffMs = today.getTime() - startDate.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
	const daysElapsed = Math.max(0, Math.min(diffDays, 84));

	const streakSorted = participants;
	const totalSorted = [...participants].sort((a, b) => b.totalSteps - a.totalSteps);

	// only include days that have fully passed (exclude today)
	const passedDays = Math.max(0, daysElapsed - 1);
	participants.forEach((p) => {
		p.daily = p.daily.slice(0, passedDays);
	});

	return { participants: streakSorted, totalSorted, top5, daysElapsed };
};
