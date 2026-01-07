import { Body } from "@react-email/body";
import { Column } from "@react-email/column";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import React from "react";
import { TailwindConfig } from "../components/tailwind-config";


interface IForgotPasswordProps {
  confirmationCode: string;
}

export default function ForgotPassword({ confirmationCode }: IForgotPasswordProps) {
  return (
    <TailwindConfig>
      <Html>
        <Head />
        <Body>
          <Section>
            <Row>
              <Column className="font-sans text-center pt-10">
                <Heading as="h1" className="text-2xl leading-[0]">
                  Recupere sua senha
                </Heading>
                <Heading className="font-normal text-base text-gray-600">
                  Resete a sua senha e volte ao foco 💪
                </Heading>
              </Column>
            </Row>


            <Row>
              <Column className="text-center " >
                <span className="inline-block bg-gray-200 px-8 py-4 text-3xl font-sans rounded-md tracking-[16px]">{confirmationCode}</span>
              </Column>
            </Row>


            <Row>
              <Column className=" pt-10 text-center font-sans">
                <Text className="text-sm text-gray-600">Se voce nao solicitou essa alteração, por favor ignore este email.</Text>
              </Column>
            </Row>
          </Section>
        </Body>
      </Html>
    </TailwindConfig>
  );
}


ForgotPassword.PreviewProps = {
  confirmationCode: "123456"
}
