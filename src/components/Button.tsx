import styled from "@emotion/styled/macro";

export const Button = styled("button")({
  border: "none",
  borderRadius: "0.25rem",
  padding: "0.5rem",
  cursor: "pointer",
  backgroundColor: "var(--white)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "2rem",
  minWidth: "2rem",
  img: {
    width: "1rem",
    height: "1rem",
  },
  "&:disabled": {
    opacity: 0.15,
    cursor: "not-allowed",
  },
});
