import styled from "@emotion/styled";
import { slugify, titleCase } from "./../helpers/string";

interface Props {
  name: string;
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
}

export const ButtonClient: React.FC<Props> = (props) => {
  const { name, label, onClick, disabled, children } = props;

  const onClickHandler = () => {
    if (onClick && !disabled) onClick();
  };
  return (
    <Container
      id={`color_${slugify(name)}`}
      onClick={onClickHandler}
      disabled={disabled || false}
      selected={props.selected || false}
    >
      {children && children}
      {label && titleCase(label)}
    </Container>
  );
};

const Container = styled("button")(
  (props: { disabled: boolean; selected: boolean }) => ({
    display: "flex",
    gap: "0.5rem",
    opacity: props.disabled ? 0.5 : 1,
    cursor: props.disabled ? "not-allowed" : "pointer",
    borderRadius: "0.25rem",
    // padding: "0.5rem 1rem",
    border: "none",
    backgroundColor: "var(--white)",
    color: "var(--black)",
    width: "2rem",
    height: "2rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    img: {
      width: "1rem",
      height: "1rem",
    },
  })
);
