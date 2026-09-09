import { SALEOR_GRAPHQL_ENDPOINT } from './catalog';

export interface SaleorAddress {
  id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  cityArea?: string;
  postalCode?: string;
  countryArea?: string;
  phone?: string;
  country: {
    code: string;
    country: string;
  };
  isDefaultShippingAddress?: boolean;
  isDefaultBillingAddress?: boolean;
}

export interface SaleorUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isStaff?: boolean;
  defaultShippingAddress?: SaleorAddress | null;
  defaultBillingAddress?: SaleorAddress | null;
  addresses?: SaleorAddress[];
  orders?: {
    edges: Array<{
      node: {
        id: string;
        number: string;
        status: string;
        created: string;
        total: {
          gross: {
            amount: number;
            currency: string;
          };
        };
        lines: Array<{
          productName: string;
          variantName: string;
          quantity: number;
        }>;
      };
    }>;
  };
}

const TOKEN_KEY = 'kylin_saleor_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function saleorLogin(email: string, password: string): Promise<{ token: string; user: SaleorUser }> {
  const query = `
    mutation TokenCreate($email: String!, $password: String!) {
      tokenCreate(email: $email, password: $password) {
        token
        errors {
          field
          message
        }
        user {
          id
          email
          firstName
          lastName
          isStaff
        }
      }
    }
  `;

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { email, password } }),
  });

  const data = await res.json();
  const payload = data?.data?.tokenCreate;

  if (payload?.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0].message || 'Invalid credentials');
  }

  if (!payload?.token) {
    throw new Error('Authentication failed: no token returned');
  }

  setStoredToken(payload.token);
  return { token: payload.token, user: payload.user };
}

export async function saleorRegister(email: string, password: string): Promise<void> {
  const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/account` : 'https://kylintattoo.com/account';
  const query = `
    mutation AccountRegister($email: String!, $password: String!, $redirectUrl: String!) {
      accountRegister(input: {
        email: $email
        password: $password
        channel: "default-channel"
        redirectUrl: $redirectUrl
      }) {
        errors {
          field
          message
        }
        user {
          id
          email
        }
      }
    }
  `;

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { email, password, redirectUrl } }),
  });

  const data = await res.json();
  const payload = data?.data?.accountRegister;

  if (payload?.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0].message || 'Registration failed');
  }
}

export interface AddressInputData {
  firstName: string;
  lastName: string;
  companyName?: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  cityArea?: string;
  postalCode?: string;
  country: string;
  countryArea?: string;
  phone?: string;
}

export async function fetchSaleorMe(token: string): Promise<SaleorUser | null> {
  const query = `
    query CurrentCustomer {
      me {
        id
        email
        firstName
        lastName
        isStaff
        defaultShippingAddress {
          id
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          postalCode
          countryArea
          phone
          country {
            code
            country
          }
          isDefaultShippingAddress
          isDefaultBillingAddress
        }
        defaultBillingAddress {
          id
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          postalCode
          countryArea
          phone
          country {
            code
            country
          }
          isDefaultShippingAddress
          isDefaultBillingAddress
        }
        addresses {
          id
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          postalCode
          countryArea
          phone
          country {
            code
            country
          }
          isDefaultShippingAddress
          isDefaultBillingAddress
        }
        orders(first: 10) {
          edges {
            node {
              id
              number
              status
              created
              total {
                gross {
                  amount
                  currency
                }
              }
              lines {
                productName
                variantName
                quantity
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    return data?.data?.me || null;
  } catch (err) {
    console.warn('Failed to fetch me from Saleor:', err);
    return null;
  }
}

export async function saleorUpdateAccount(
  token: string,
  input: { firstName?: string; lastName?: string }
): Promise<SaleorUser> {
  const query = `
    mutation UpdateAccount($input: AccountInput!) {
      accountUpdate(input: $input) {
        user {
          id
          email
          firstName
          lastName
          isStaff
        }
        errors {
          field
          message
        }
      }
    }
  `;

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { input } }),
  });

  const data = await res.json();
  const payload = data?.data?.accountUpdate;
  if (payload?.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0].message || 'Failed to update account');
  }

  return payload.user;
}

export async function saleorChangePassword(
  token: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const query = `
    mutation ChangeCustomerPassword($oldPassword: String!, $newPassword: String!) {
      passwordChange(oldPassword: $oldPassword, newPassword: $newPassword) {
        errors {
          field
          message
        }
      }
    }
  `;

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { oldPassword, newPassword } }),
  });

  const data = await res.json();
  const payload = data?.data?.passwordChange;
  if (payload?.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0].message || 'Failed to change password');
  }
}

export async function saleorCreateAddress(
  token: string,
  input: AddressInputData,
  type?: 'SHIPPING' | 'BILLING'
): Promise<SaleorAddress> {
  const query = `
    mutation CreateCustomerAddress($input: AddressInput!, $type: AddressTypeEnum) {
      accountAddressCreate(input: $input, type: $type) {
        address {
          id
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          postalCode
          countryArea
          phone
          country {
            code
            country
          }
          isDefaultShippingAddress
          isDefaultBillingAddress
        }
        errors {
          field
          message
        }
      }
    }
  `;

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { input, type: type || 'SHIPPING' } }),
  });

  const data = await res.json();
  const payload = data?.data?.accountAddressCreate;
  if (payload?.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0].message || 'Failed to create address');
  }

  return payload.address;
}

export async function saleorUpdateAddress(
  token: string,
  id: string,
  input: AddressInputData
): Promise<SaleorAddress> {
  const query = `
    mutation UpdateCustomerAddress($id: ID!, $input: AddressInput!) {
      accountAddressUpdate(id: $id, input: $input) {
        address {
          id
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          postalCode
          countryArea
          phone
          country {
            code
            country
          }
          isDefaultShippingAddress
          isDefaultBillingAddress
        }
        errors {
          field
          message
        }
      }
    }
  `;

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { id, input } }),
  });

  const data = await res.json();
  const payload = data?.data?.accountAddressUpdate;
  if (payload?.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0].message || 'Failed to update address');
  }

  return payload.address;
}

export async function saleorDeleteAddress(token: string, id: string): Promise<void> {
  const query = `
    mutation DeleteCustomerAddress($id: ID!) {
      accountAddressDelete(id: $id) {
        errors {
          field
          message
        }
      }
    }
  `;

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { id } }),
  });

  const data = await res.json();
  const payload = data?.data?.accountAddressDelete;
  if (payload?.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0].message || 'Failed to delete address');
  }
}

export async function saleorSetDefaultAddress(
  token: string,
  id: string,
  type: 'SHIPPING' | 'BILLING'
): Promise<void> {
  const query = `
    mutation SetDefaultCustomerAddress($id: ID!, $type: AddressTypeEnum!) {
      accountSetDefaultAddress(id: $id, type: $type) {
        errors {
          field
          message
        }
      }
    }
  `;

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { id, type } }),
  });

  const data = await res.json();
  const payload = data?.data?.accountSetDefaultAddress;
  if (payload?.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0].message || 'Failed to set default address');
  }
}

export interface CheckoutInput {
  email: string;
  lines: Array<{
    variantId: string;
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    city: string;
    country: string;
    postalCode?: string;
    countryArea?: string;
    phone?: string;
  };
}

export interface ShippingMethodItem {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  minimumDeliveryDays?: number | null;
  maximumDeliveryDays?: number | null;
}

export interface SaleorCheckoutResult {
  id: string;
  totalGrossAmount: number;
  currency: string;
  shippingMethods: ShippingMethodItem[];
  lines?: any[];
  errors?: Array<{
    field: string | null;
    message: string;
    code: string;
  }>;
}

export interface SaleorOrderResult {
  id: string;
  number: string;
  status: string;
  totalAmount: number;
  currency: string;
  shippingMethodName?: string;
  lines: Array<{
    productName: string;
    variantName?: string;
    quantity: number;
  }>;
}

export async function saleorCreateCheckout(
  input: CheckoutInput,
  userToken?: string | null
): Promise<SaleorCheckoutResult> {
  const query = `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          totalPrice {
            gross {
              amount
              currency
            }
          }
          shippingMethods {
            id
            name
            price {
              amount
              currency
            }
            minimumDeliveryDays
            maximumDeliveryDays
          }
          lines {
            id
            quantity
            variant {
              id
              name
              sku
            }
          }
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;

  // Map country name or ISO code to 2-letter uppercase ISO-3166 code
  const rawCountry = (input.shippingAddress.country || 'US').trim().toUpperCase();
  const countryCodeMap: Record<string, string> = {
    'UNITED STATES': 'US',
    'US': 'US',
    'USA': 'US',
    'CANADA': 'CA',
    'CA': 'CA',
    'UNITED KINGDOM': 'GB',
    'UK': 'GB',
    'GB': 'GB',
    'GERMANY': 'DE',
    'DE': 'DE',
    'AUSTRALIA': 'AU',
    'AU': 'AU',
    'CHINA': 'CN',
    'CN': 'CN',
    'JAPAN': 'JP',
    'JP': 'JP',
    'FRANCE': 'FR',
    'FR': 'FR',
    'ITALY': 'IT',
    'IT': 'IT',
    'SPAIN': 'ES',
    'ES': 'ES',
  };
  const countryCode = countryCodeMap[rawCountry] || (rawCountry.length === 2 ? rawCountry : 'US');

  const lines = input.lines.map(line => ({
    variantId: line.variantId,
    quantity: line.quantity,
  }));

  const address = {
    firstName: input.shippingAddress.firstName?.trim() || '',
    lastName: input.shippingAddress.lastName?.trim() || '',
    streetAddress1: input.shippingAddress.streetAddress1?.trim() || '',
    city: input.shippingAddress.city?.trim() || '',
    country: countryCode,
    postalCode: input.shippingAddress.postalCode?.trim() || '',
    countryArea: input.shippingAddress.countryArea?.trim() || '',
    phone: input.shippingAddress.phone?.trim() || '',
  };

  const variables = {
    input: {
      channel: import.meta.env.VITE_SALEOR_CHANNEL || 'default-channel',
      email: input.email,
      lines,
      shippingAddress: address,
      billingAddress: address,
    },
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();
  const payload = data?.data?.checkoutCreate;

  if (payload?.errors && payload.errors.length > 0) {
    const errorMsg = payload.errors.map((e: any) => `${e.field || 'General'}: ${e.message}`).join('; ');
    throw new Error(errorMsg);
  }

  if (!payload?.checkout) {
    throw new Error('Saleor checkout could not be created. Please verify stock availability and address.');
  }

  return {
    id: payload.checkout.id,
    totalGrossAmount: payload.checkout.totalPrice?.gross?.amount || 0,
    currency: payload.checkout.totalPrice?.gross?.currency || 'USD',
    shippingMethods: payload.checkout.shippingMethods || [],
    lines: payload.checkout.lines || [],
  };
}

export async function saleorUpdateDeliveryMethod(
  checkoutId: string,
  deliveryMethodId: string,
  userToken?: string | null
): Promise<{ totalGrossAmount: number; currency: string; shippingPrice: number }> {
  const query = `
    mutation UpdateDeliveryMethod($id: ID!, $deliveryMethodId: ID!) {
      checkoutDeliveryMethodUpdate(id: $id, deliveryMethodId: $deliveryMethodId) {
        checkout {
          id
          shippingPrice {
            gross {
              amount
              currency
            }
          }
          totalPrice {
            gross {
              amount
              currency
            }
          }
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables: { id: checkoutId, deliveryMethodId } }),
  });

  const data = await res.json();
  const payload = data?.data?.checkoutDeliveryMethodUpdate;

  if (payload?.errors && payload.errors.length > 0) {
    const errorMsg = payload.errors.map((e: any) => `${e.field || 'General'}: ${e.message}`).join('; ');
    throw new Error(errorMsg);
  }

  return {
    totalGrossAmount: payload?.checkout?.totalPrice?.gross?.amount || 0,
    currency: payload?.checkout?.totalPrice?.gross?.currency || 'USD',
    shippingPrice: payload?.checkout?.shippingPrice?.gross?.amount || 0,
  };
}

export async function saleorCompleteCheckout(
  checkoutId: string,
  userToken?: string | null,
  metadata?: Array<{ key: string; value: string }>
): Promise<SaleorOrderResult> {
  const query = `
    mutation CompleteCheckout($id: ID!, $metadata: [MetadataInput!]) {
      checkoutComplete(id: $id, metadata: $metadata) {
        order {
          id
          number
          status
          total {
            gross {
              amount
              currency
            }
          }
          shippingMethodName
          lines {
            id
            productName
            variantName
            quantity
          }
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const variables: Record<string, any> = { id: checkoutId };
  if (metadata && metadata.length > 0) {
    variables.metadata = metadata;
  }

  const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();
  const payload = data?.data?.checkoutComplete;

  if (payload?.errors && payload.errors.length > 0) {
    const errorMsg = payload.errors.map((e: any) => `${e.field || 'General'}: ${e.message}`).join('; ');
    throw new Error(errorMsg);
  }

  if (!payload?.order) {
    throw new Error('Saleor order placement could not be completed.');
  }

  return {
    id: payload.order.id,
    number: payload.order.number,
    status: payload.order.status,
    totalAmount: payload.order.total?.gross?.amount || 0,
    currency: payload.order.total?.gross?.currency || 'USD',
    shippingMethodName: payload.order.shippingMethodName,
    lines: payload.order.lines || [],
  };
}
