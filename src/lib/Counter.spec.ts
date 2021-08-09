import Counter from "./Counter.svelte"
import { render, fireEvent } from "@testing-library/svelte"

it("it works", async () => {
  // <Counter count={10} />
  const { getByText, getByTestId } = render(Counter, {
    count: 20,
  })

  const increment = getByText("+")
  const decrement = getByText("-")
  const reset = getByText("Reset")
  const counter = getByTestId("counter-value")

  expect(counter).toHaveTextContent("20")

  await fireEvent.click(increment)

  expect(counter).toHaveTextContent("21")

  await fireEvent.click(increment)

  expect(counter).toHaveTextContent("22")

  await fireEvent.click(decrement)

  expect(counter).toHaveTextContent("21")

  await fireEvent.click(reset)

  expect(counter).toHaveTextContent(/^0$/)
})

describe("increment button", () => {
  it("increases counter by 1 per click", async () => {
    const { getByText, getByTestId } = render(Counter, {
      count: 0,
    })

    const counter = getByTestId("counter-value")
    const increment = getByText("+")

    await fireEvent.click(increment)
    await fireEvent.click(increment)

    expect(counter).toHaveTextContent("2")
  })
})

describe("decrement button", () => {
  it("decreases counter by 1 per click", async () => {
    const { getByText, getByTestId } = render(Counter, {
      count: 10,
    })

    const counter = getByTestId("counter-value")
    const decrement = getByText("-")

    await fireEvent.click(decrement)
    await fireEvent.click(decrement)

    expect(counter).toHaveTextContent("8")
  })
})

describe("reset button", () => {
  it("sets the counter to 0", async () => {
    const { getByText, getByTestId } = render(Counter, {
      count: 10,
    })

    const counter = getByTestId("counter-value")
    const reset = getByText("Reset")

    await fireEvent.click(reset)

    expect(counter).toHaveTextContent(/^0$/)
  })
})
