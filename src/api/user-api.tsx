import supabase from "./supabase";

export const getUser = async (email: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email);
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
  disableBlockchain
}