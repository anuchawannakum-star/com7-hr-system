import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, caseUuid, status } = body;

    // Mock email sending - log to console instead of using resend
    console.log('====== MOCK EMAIL SENT ======');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Case UUID:', caseUuid);
    console.log('Status:', status);
    console.log('Timestamp:', new Date().toISOString());
    console.log('============================');

    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully (mock)',
      data: {
        to,
        subject,
        caseUuid,
        status,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
