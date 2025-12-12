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

        const query = `*[_type == "footerSettings"][0] {
      helpSupport {
        sectionTitle,
        address { text, "icon": icon.asset->url },
        phone { number, "icon": icon.asset->url },
        email { address, "icon": icon.asset->url }
      },
      quickLinks {
        sectionTitle,
        links[] { label, url }
      },
      accountLinks {
        sectionTitle,
        links[] { label, url }
      },
      socialLinks {
        sectionTitle,
        description,
        platforms[] {
          name,
          url,
          "icon": icon.asset->url,
          iconSvg,
          bgColor
        }
      },
      paymentMethods {
        sectionTitle,
        methods[] {
          name,
          "icon": icon.asset->url,
          bgColor
        }
      },
      copyrightText,
      founderName
    }`;

        const settings = await client.fetch(query);

        return NextResponse.json({
            success: true,
            settings: settings || null
        });
    } catch (error) {
        console.error('Error fetching footer settings:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch footer settings',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
