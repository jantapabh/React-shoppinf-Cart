import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";

//Componrnts
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCarttIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";

//Styled
import { Wrapper, StyledButton } from "./App.styles";

//Css
import "./App.css";

//Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch("https://fakestoreapi.com/products")).json();

const App = () => {
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddtoCart = (clickedItem: CartItemType) => {
    console.log("Click Me!!");
    setCartItems((prev) => {
      //1. Is the item already addes in the cart
      const isItemInCart = prev.find((item) => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? {
                ...item,
                amount: item.amount + 1,
              }
            : item
        );
      }
      // First time the item is add
      return [...prev, { ...clickedItem, amount: 1 }];
    });
    console.log("Click Me");
  };
  const removeFromCart = (id: number) => {
    setCartItems((prev) =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  console.log("Loading --> ", isLoading);

  if (isLoading)
    return (
      <div>
        <LinearProgress />
      </div>
    );

  if (error)
    return (
      <div>
        <h1>ERROR</h1>
      </div>
    );

  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddtoCart}
          removeFromCart={removeFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCarttIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddtoCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
