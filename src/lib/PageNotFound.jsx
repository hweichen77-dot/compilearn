import { Link, useLocation } from 'react-router-dom';
import { font } from '@/lib/tokens';

export default function PageNotFound() {
    const { pathname } = useLocation();

    return (
        <div
            className="min-h-screen flex items-center justify-center px-6 py-20"
            style={{ background: '#070B0A' }}
        >
            <div className="max-w-lg w-full text-center">
                <p
                    className="text-7xl leading-none"
                    style={{ fontFamily: font.display, fontWeight: 800, color: '#5ED29C', letterSpacing: '-0.03em' }}
                >
                    404
                </p>

                <h1
                    className="mt-6 text-3xl"
                    style={{ fontFamily: font.display, fontWeight: 700, color: '#ECF3EF', letterSpacing: '-0.02em' }}
                >
                    That page is not here
                </h1>

                <p className="mt-4 text-sm" style={{ color: '#FFFFFF', lineHeight: 1.7, fontFamily: font.body }}>
                    Nothing on Compilearn matches{' '}
                    <span className="break-all" style={{ color: '#5ED29C' }}>{pathname}</span>. The link may be out of
                    date, or the address may have a typo in it.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{ background: '#5ED29C', color: '#070B0A' }}
                    >
                        Go to the home page
                    </Link>
                    <Link
                        to="/AITrack"
                        className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{ borderColor: '#22302A', color: '#ECF3EF' }}
                    >
                        Browse the tracks
                    </Link>
                </div>
            </div>
        </div>
    );
}
