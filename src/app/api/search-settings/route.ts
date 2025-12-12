import { NextResponse } from 'next/server';
import { client } from '../../../../lib/sanity';

export async function GET() {
    try {
        if (!client) {
            return NextResponse.json({
                success: false,
                error: 'Sanity client not initialized'
            }, { status: 500 });
        }

        const query = `*[_type == "searchSettings"][0] {
      quickSearch[] {
        label,
        url
      },
      popularSearches
    }`;

        const settings = await client.fetch(query);

        return NextResponse.json({
            success: true,
            settings: settings || {
                quickSearch: [],
                popularSearches: []
            }
        });
    } catch (error) {
        console.error('Error fetching search settings:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch search settings',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
