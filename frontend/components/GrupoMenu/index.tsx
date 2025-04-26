import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";

import EditarIcon from "../../../assets/images/editar.svg";
import SairIcon from "../../../assets/images/sair.svg";
import ExcluirIcon from "../../../assets/images/excluir.svg";

interface GrupoMenuProps {
  isAdmin: boolean;
  sozinho: boolean;
  onSairGrupo: () => void;
  onRenomearGrupo: () => void;
  onExcluirGrupo: () => void;
}

const GrupoMenu: React.FC<GrupoMenuProps> = ({
  isAdmin,
  sozinho,
  onSairGrupo,
  onRenomearGrupo,
  onExcluirGrupo,
}) => {
  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
          triggerWrapper: {
            backgroundColor: "#F5F5F5",
            borderRadius: 4,
            padding: 4,
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <View style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
          <View style={{ width: 4, height: 4, backgroundColor: "#808080", borderRadius: 4 }} />
          <View style={{ width: 4, height: 4, backgroundColor: "#808080", borderRadius: 4, marginTop: 3 }} />
          <View style={{ width: 4, height: 4, backgroundColor: "#808080", borderRadius: 4, marginTop: 3 }} />
        </View>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            padding: 10,
            borderRadius: 8,
          },
        }}
      >
        {/* Renomear grupo */}
        {isAdmin && (
          <MenuOption onSelect={onRenomearGrupo}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
              <EditarIcon width={20} height={20} color="#404040" strokeWidth={2} />
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 14,
                  color: "#404040",
                  fontFamily: "Inter-Medium",
                }}
              >
                Renomear Grupo
              </Text>
            </View>
          </MenuOption>
        )}

        {/* Sair do Grupo */}
        <MenuOption onSelect={!sozinho ? onSairGrupo : undefined}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
            <SairIcon width={20} height={18} color={sozinho ? "#C4C4C4" : "#404040"} strokeWidth={2} />
            <Text
              style={{
                marginLeft: 20,
                fontSize: 14,
                color: sozinho ? "#C4C4C4" : "#404040",
                fontFamily: "Inter-Medium",
              }}
            >
              Sair do Grupo
            </Text>
          </View>
        </MenuOption>

        {/* Excluir Grupo */}
        {isAdmin && (
          <MenuOption onSelect={!sozinho ? onExcluirGrupo : undefined}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
              <ExcluirIcon width={20} height={20} color={sozinho ? "#C4C4C4" : "#E7516E"} strokeWidth={2} />
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 14,
                  color: sozinho ? "#C4C4C4" : "#C22E63",
                  fontFamily: "Inter-Medium",
                }}
              >
                Excluir Grupo
              </Text>
            </View>
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  );
};

export default GrupoMenu;