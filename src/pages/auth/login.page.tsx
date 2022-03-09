import { ChangeEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  InputForm,
  Input,
  Logo,
  PageContainer,
  Row,
  Button,
} from "../../components/common";
import { postLogin } from "../../services/auth";
import Cookie from "../../utils/cookie.util";

export default function LoginPage() {
  const [inputText, setInputText] = useState({ email: "", code: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputText((prev) => ({ ...prev, [name]: value }));
  }, []);

  const onLoginPress = useCallback(async () => {
    setLoading(true);
    try {
      const result = await postLogin({
        email: inputText.email,
        code: inputText.code,
      });

      console.log({ result, res: result.token.token });

      if (result.token.token) navigate("meeting");
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  }, [inputText, navigate]);

  const onTestLoginPress = useCallback(() => {
    Cookie.set("jwt", "Bearer test", 2);
    navigate("meeting");
  }, [navigate]);

  return (
    <PageContainer>
      <Row>
        <Logo />
      </Row>
      <InputForm>
        <Input
          label="Email"
          value={inputText.email}
          name="email"
          onChange={onChange}
          placeholder={"Enter your email"}
        />
        <Input
          label="Code"
          value={inputText.code}
          name="code"
          onChange={onChange}
          placeholder={"Enter 6-digit code"}
        />
        <Button loading={loading} label="Login" onClick={onLoginPress} />
        <Button
          loading={loading}
          label="Test Login"
          onClick={onTestLoginPress}
        />
      </InputForm>
    </PageContainer>
  );
}
