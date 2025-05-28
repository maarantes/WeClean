import React from "react";
import { View, SafeAreaView } from "react-native";
import ParteCima from "@/frontend/components/ParteCima";
import { Navbar } from "../Navbar";

const PaginaWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ParteCima />

      <View style={{ flex: 1 }}>{children}</View>
      
      <Navbar />
    </SafeAreaView>
  );
};

export default PaginaWrapper;
