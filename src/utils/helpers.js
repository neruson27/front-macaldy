import apolloClient from '@/utils/apollo'
import { EMAIL_UNIQUE_QUERY, AFFILIATE_CODE_EXIST_QUERY } from '@/graphql/seguridad'
import { UNIQUE_CODE_EXIST } from '@/graphql/user'

export function esUnico (email, isValid) {
  if (email && email !== '' && isValid) {
    return apolloClient
      .query({
        query: EMAIL_UNIQUE_QUERY,
        variables: {
          email: email
        }
      })
      .then(res => {
        return res.data.EmailUnique
      })
      .catch(error => {
        // console.log(
        //   "hubo un error: ",
        //   error
        // );        
      })
  }
}

export function affiliateCodeExist (referredBy) {
  if (!referredBy) return true
  else if (referredBy && referredBy !== '') {
    return apolloClient
      .query({
        query: AFFILIATE_CODE_EXIST_QUERY,
        variables: {
          referredBy: referredBy
        }
      })
      .then(res => {
        return res.data.AffiliateCodeExist
      })
  }
  return false
}

export function uniqueCodeExist (uniqueCode, valid, type) {
  if (uniqueCode === '') {
    return true
    // el uniqueCode debe tener caracteres hexadecimal y tamaño 12
  } else if (valid) {
    return apolloClient
      .query({
        query: UNIQUE_CODE_EXIST,
        variables: {
          uniqueCode: uniqueCode, type: type
        }
      })
      .then(res => {
        return res.data.UniqueCodeExist
      })
  }
  return false
}