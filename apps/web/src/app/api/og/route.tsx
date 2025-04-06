import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { LogoIcon } from '../../components/icons/logo';
import { trackError } from '../../utils/error-monitoring';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #000510, #001030)',
            color: 'white',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              background: '#1f2a57',
              borderRadius: '20px',
              marginBottom: '30px',
            }}
          >
            <LogoIcon size={120} />
          </div>
          <div
            style={{ fontSize: '70px', fontWeight: 'bold', margin: '10px 0' }}
          >
            Unbuilt.app
          </div>
          <div style={{ fontSize: '32px', marginBottom: '10px', opacity: 0.9 }}>
            Unbuilding the web, piece by piece
          </div>
          <div style={{ fontSize: '24px', opacity: 0.7 }}>
            See the exact technologies powering any web app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    const url = request.url;
    trackError(error as Error, { url });
    return new Response(
      `Failed to generate image: ${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
