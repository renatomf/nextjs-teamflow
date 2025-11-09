import z from "zod";
import { heavyWriteSecurityMiddleware } from "../middlewares/arcjet/heavy-write";
import { standardSecurityMiddleware } from "../middlewares/arcjet/standard";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { base } from "../middlewares/base";
import { inviteMemberSchema } from "../schemas/member";
import { init, organization_user, Organizations, Users } from "@kinde/management-api-js";
import { getAvatar } from "@/lib/get-avatar";

export const inviteMember = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/workspace/members/invite",
    summary: "Invite Member",
    tags: ["Members"],
  })
  .input(inviteMemberSchema)
  .output(z.void())
  .handler(async ({ input, context, errors }) => {
    try {
      init();

      await Users.createUser({
        requestBody: {
          organization_code: context.workspace.orgCode,
          profile: {
            given_name: input.name,
            picture: getAvatar(null, input.email),
          },
          identities: [
            {
              type: "email",
              details: {
                email: input.email,
              },
            },
          ],
        },
      });
    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

  export const listMembers = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "GET",
    path: "/workspace/members",
    summary: "List All Members",
    tags: ["Members"],
  })
  .input(z.void())
  .output(z.array(z.custom<organization_user>()))
  .handler(async ({ input, context, errors }) => {
    try {
      init();

      const data = await Organizations.getOrganizationUsers({
        orgCode: context.workspace.orgCode,
        sort: "name_asc",
      });

      if (!data.organization_users) {
        throw errors.NOT_FOUND()
      }

      return data.organization_users;

    } catch {
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
