import styled from "@emotion/styled";
import { slugify, titleCase } from "./../helpers/string";

interface Props {
  name: string;
  label?: string;
  fitWidth?: boolean;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<Props> = (props) => {
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
      fitWidth={props.fitWidth || false}
    >
      {children && children}
      {label && titleCase(label)}
    </Container>
  );
};

const Container = styled("button")(
  (props: { disabled: boolean; selected: boolean; fitWidth: boolean }) => ({
    display: "flex",
    gap: "0.5rem",
    opacity: props.disabled ? 0.5 : 1,
    cursor: props.disabled ? "not-allowed" : "pointer",
    borderRadius: "0.25rem",
    padding: "0.5rem 1rem",
    border: "2px solid var(--color-primary)",
    backgroundColor: props.selected ? "var(--color-primary)" : "transparent",
    color: props.selected
      ? "var(--color-controlpanel-bg)"
      : "var(--color-primary)",
    width: props.fitWidth ? "undefined" : "100%",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    img: {
      width: "0.75rem",
      height: "0.75rem",
    },
  })
);
