import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { LogoIcon } from '../components/icons/logo';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const background = 'rgb(15, 16, 28)';
    const primary = '#ffffff';
    const secondary = '#2D39AA';
    const action = '#4455FF';

    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Unbuilt.app';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            backgroundColor: background,
            position: 'relative',
          }}
        >
          {/* Main Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Logo and Title Container */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: 100,
                marginTop: 200,
              }}
            >
              {/* Logo Container */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  height: 120,
                  backgroundColor: '#15183a',
                  borderRadius: 24,
                }}
              >
                <LogoIcon size={120} />
              </div>

              {/* Title */}
              <div
                style={{
                  marginLeft: 20,
                  fontSize: 64,
                  fontWeight: 'bold',
                  color: primary,
                }}
              >
                {title}
              </div>
            </div>

            {/* Description Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 100,
                marginTop: 60,
                gap: 20,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  color: primary,
                  opacity: 0.7,
                }}
              >
                See the exact technologies powering any web app
              </div>
            </div>
          </div>

          {/* Background Grid (Absolute positioned) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0v40h40V0zm0 1H1v38h38V1z' fill='%232D39AA' fill-opacity='0.1'/%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px',
              opacity: 0.8,
            }}
          />

          {/* Decorative Elements (Absolute positioned) */}
          <div
            style={{
              position: 'absolute',
              top: 150,
              right: 100,
              width: 300,
              height: 200,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg width="300" height="200" viewBox="0 0 300 200">
              <rect
                x="20"
                y="0"
                width="40"
                height="40"
                rx="10"
                fill={action}
                transform="rotate(15)"
              />
              <rect
                x="100"
                y="50"
                width="30"
                height="30"
                rx="6"
                fill={secondary}
                transform="rotate(-10)"
              />
              <rect
                x="180"
                y="20"
                width="35"
                height="35"
                rx="7"
                fill={action}
                transform="rotate(25)"
              />
              <rect
                x="50"
                y="100"
                width="45"
                height="45"
                rx="9"
                fill={secondary}
                transform="rotate(-20)"
              />
            </svg>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response(
      `Failed to generate image: ${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
}
