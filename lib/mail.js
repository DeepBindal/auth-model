import nodemailer from "nodemailer"
import Handlebars from "handlebars";
import { activationTemplate } from "./emailtemplates/activation";
import { resetPasswordTemplate } from "./emailtemplates/resetPass";

export async function sendMail({to, subject, body}){
    const {SMTP_MAIL, SMTP_PASS} = process.env;

    // const transport = nodemailer.createTransport({
    //     service:"gmail",
    //     auth: {
    //         user: SMTP_MAIL,
    //         pass: SMTP_PASS,
    //     },
    // });
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "8b03c32686732e",
          pass: "bd35766854e1b9"
        }
      });
    try {
        const testResult = await transport.verify();
        console.log("Test result of transport", testResult);
        
    } catch (error) {
        console.log(error)
    }

    try {
        const sendResult = await transport.sendMail({
            from: SMTP_MAIL,
            to,
            html: body, 
            subject
        })
        console.log({sendResult});
    } catch (error) {
        
    }
}

export function compileActivationTemplate(name, url) {
    const template = Handlebars.compile(activationTemplate);
    const htmlBody = template({
      name,
      url,
    });
    return htmlBody;
  }
export function compilePassTemplate(name, url) {
    const template = Handlebars.compile(resetPasswordTemplate);
    const htmlBody = template({
      name,
      url,
    });
    return htmlBody;
  }