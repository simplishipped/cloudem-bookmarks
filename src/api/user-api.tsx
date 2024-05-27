import supabase from "./supabase";


const getAuth = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (data) {
    return data
  } else {
    return false;
  }
}

const signUpUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password,
  })
  if (data) {
    return data
  } else {
    return false;
  }
}

const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password,
  })
  if (data) {
    return data
  } else {
    return false;
  }
}

const createUser = async (user: any) => {
  const { data, error } = await supabase.from('users').insert(user).select('*');
  if (data) {
    const response = await supabase.from('collections').insert({
      name: 'default',
      user_id: data[0].id,
    }).select('*');
    if (data && response) {
      return data[0]
    } else {
      return false;
    }
  }

}
export const getUser = async (email: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email);
  if (data) {
    return data[0]
  } else {
    return false;
  }
}

export const getUserByWalletAddr = async (walletaddr: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('walletaddr_arb', walletaddr);
  if (data) {
    return data[0]
  } else {
    return false;
  }
}

const updateUser = async (id: number, user: any) => {
  const { data, error } = await supabase.from('users').update(user).eq('id', id).select();
  if (data) {
    return data
  } else {
    return false;
  }
}
const disableBlockchain = async (id: number) => {
  const { data, error } = await supabase.from('users').update({ 'blockchain_enabled': false }).eq('id', id).select();
  console.log(data)
  if (data) {
    return data
  } else {
    return false;
  }
}



export default {
  getUser,
  disableBlockchain,
  updateUser,
  getAuth,
  getUserByWalletAddr,
  createUser,
  signUpUser,
  signInUser
}