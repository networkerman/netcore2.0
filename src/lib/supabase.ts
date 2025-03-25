import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getActiveSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string, metadata?: { full_name?: string; company_name?: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Session management
export const createSession = async (userId: string, userAgent: string, ipAddress: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert([
      {
        user_id: userId,
        user_agent: userAgent,
        ip_address: ipAddress,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSessionActivity = async (sessionId: string) => {
  const { error } = await supabase
    .from('sessions')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
};

export const endSession = async (sessionId: string) => {
  const { error } = await supabase
    .from('sessions')
    .update({ is_active: false })
    .eq('id', sessionId);

  if (error) throw error;
};

// Credit management
export const getCreditBalance = async (userId: string) => {
  const { data, error } = await supabase
    .from('credit_balances')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const getServiceRates = async () => {
  const { data, error } = await supabase
    .from('service_rates')
    .select('*');

  if (error) throw error;
  return data;
};

export const getCreditTransactions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching credit transactions:', error);
    throw error;
  }
};

interface CreateCreditTransactionParams {
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  service?: 'whatsapp' | 'email' | 'sms';
  reference?: string;
}

export const createCreditTransaction = async (params: CreateCreditTransactionParams) => {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .insert([
        {
          user_id: params.userId,
          amount: params.amount,
          type: params.type,
          status: params.status,
          description: params.description,
          service: params.service,
          reference: params.reference,
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // If the transaction is completed, update the credit balance
    if (params.status === 'completed') {
      const balanceChange = params.type === 'credit' ? params.amount : -params.amount;
      await updateCreditBalance(params.userId, balanceChange);
    }

    return data;
  } catch (error) {
    console.error('Error creating credit transaction:', error);
    throw error;
  }
};

const updateCreditBalance = async (userId: string, amount: number) => {
  try {
    const { data: existingBalance, error: fetchError } = await supabase
      .from('credit_balances')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const newBalance = (existingBalance?.balance || 0) + amount;

    const { error: updateError } = await supabase
      .from('credit_balances')
      .upsert({
        user_id: userId,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error('Error updating credit balance:', error);
    throw error;
  }
}; 