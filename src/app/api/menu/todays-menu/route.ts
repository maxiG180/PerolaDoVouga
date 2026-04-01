import { NextResponse } from 'next/server';
import { getTodaysMenuData } from '@/services/menuService';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = await getTodaysMenuData();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in todays-menu API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
