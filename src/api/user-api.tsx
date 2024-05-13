import supabase from "./supabase";

export const getUser = async (email: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email);
  if (data) {
    return data
  } else {
    return false;
  }
}


export default {
  getUser
}