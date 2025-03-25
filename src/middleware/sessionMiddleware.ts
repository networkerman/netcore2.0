import { supabase } from '@/lib/supabase';

const MAX_CONCURRENT_SESSIONS = 100;
const SESSION_TIMEOUT_MINUTES = 30;

export const checkSession = async (sessionId: string) => {
  try {
    // Get current session
    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;

    if (!session || !session.is_active) {
      throw new Error('Session not found or inactive');
    }

    // Check session timeout
    const lastActive = new Date(session.last_active_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActive.getTime()) / 1000 / 60;

    if (diffMinutes > SESSION_TIMEOUT_MINUTES) {
      await supabase
        .from('sessions')
        .update({ is_active: false })
        .eq('id', sessionId);
      throw new Error('Session expired');
    }

    // Update last active timestamp
    await supabase
      .from('sessions')
      .update({ last_active_at: now.toISOString() })
      .eq('id', sessionId);

    return true;
  } catch (error) {
    console.error('Session check failed:', error);
    return false;
  }
};

export const checkConcurrentSessions = async () => {
  try {
    const { count, error } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (error) throw error;

    if (count && count >= MAX_CONCURRENT_SESSIONS) {
      throw new Error('Maximum concurrent sessions reached');
    }

    return true;
  } catch (error) {
    console.error('Concurrent sessions check failed:', error);
    return false;
  }
};

export const cleanupInactiveSessions = async () => {
  try {
    const timeoutDate = new Date();
    timeoutDate.setMinutes(timeoutDate.getMinutes() - SESSION_TIMEOUT_MINUTES);

    await supabase
      .from('sessions')
      .update({ is_active: false })
      .lt('last_active_at', timeoutDate.toISOString())
      .eq('is_active', true);
  } catch (error) {
    console.error('Session cleanup failed:', error);
  }
};

// Run session cleanup periodically
setInterval(cleanupInactiveSessions, 5 * 60 * 1000); // Every 5 minutes 