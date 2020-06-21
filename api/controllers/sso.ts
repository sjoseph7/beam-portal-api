import axios from "axios";
import { Request, Response } from "express";
import { getUser } from "../../middleware/jwtAuth";

const OPENLEARNING_API_URL = "https://api.openlearning.com/v2.1";
const OPENLEARNING_AUTH_QUERY = `?api_key=${process.env.OPENLEARNING_API_KEY}`;

export async function getUserSsoUrl(req: Request, res: Response) {
  try {
    // Get username from token
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { username } = await getUser(token);

    // Convert username into userId
    const user_id = await getUserId(username).catch(err => {
      throw Error(`unable to get user id for ${username}`);
    });

    // Get SSO URL from OpenLearning API
    const response = await axios
      .post(
        `${OPENLEARNING_API_URL}/institutions/beam/managed-users/${user_id}/sign-on/${OPENLEARNING_AUTH_QUERY}`
      )
      .catch(err => {
        throw Error(`unable to get sso url for ${username}`);
      });

    // Concatenate results
    const { url, params } = response.data?.data || {};
    const query_params = new URLSearchParams(params);
    const ssoUrl = `${url}?${query_params}`;

    res.status(200).json({ success: true, data: { ssoUrl } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

async function getUserId(username: string): Promise<string> {
  const params = new URLSearchParams({
    external_institution_id: username,
    api_key: process.env.OPENLEARNING_API_KEY || ""
  });

  const response = await axios
    .get(`${OPENLEARNING_API_URL}/institutions/beam/managed-users/?${params}`)
    .catch(err => {
      throw Error(`unable to get user id for ${username}`);
    });

  const user_id: string = response.data?.data[0]?.user?.id || "";
  return user_id;
}
