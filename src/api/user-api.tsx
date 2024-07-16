import supabase from "./supabase";


const getAuth = async () => {
  const response = await supabase.auth.getUser();
  return response.data ? { data: response.data.user } : { error: response.error };
}

const signUpUser = async (email: string, password: string) => {
  const response = await supabase.auth.signUp({
    email: email,
    password,
  })
  return response.data ? { data: response.data.user } : { error: response.error };
}

const signInUser = async (email: string, password: string) => {
  const response = await supabase.auth.signInWithPassword({
    email: email,
    password,
  })
  return response.data ? { data: response.data.user } : { error: response.error };
}

const createUser = async (user: any) => {
  const { data, error } = await supabase.from('profiles').insert(user).select('*').single();
  let defaultCollection;
  if (data) {
    defaultCollection = await supabase.from('collections').insert({
      name: 'default',
      user_id: data.id,
    }).select('*');
  }
  if (defaultCollection && defaultCollection.data) {
    return data ? { data: data } : { error };
  } else {
    return { error: new Error('Could not create default collection') };
    //@jaja delete user
  }
}


export const getUser = async (email: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('email', email);
  return data ? { data: data[0] } : { error };
}

export const getUserByWalletAddr = async (walletaddr: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('walletaddr_arb', walletaddr);
  return data ? { data: data[0] } : { error };
}

const updateUser = async (id: number, user: any) => {
  const { data, error } = await supabase.from('profiles').update(user).eq('id', id).select();
  return data ? { data: data[0] } : { error };
}

const updateAuth = async (id: number, user: any) => {
  const { data, error } = await supabase.auth.updateUser(user)
  return data ? { data: data } : { error };
}

const disableBlockchain = async (id: number) => {
  const response = await supabase.from('profiles').update({ 'blockchain_enabled': false }).eq('id', id).select();
  return response;
}

const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();
  return data ? { data: data } : { error };
}

const signOutUser = async () => {
  const response = await supabase.auth.signOut();
  return response;
}


export default {
  getUser,
  disableBlockchain,
  updateUser,
  getAuth,
  getUserByWalletAddr,
  createUser,
  signUpUser,
  signInUser,
  updateAuth,
  getUserByEmail,
  signOutUser
}