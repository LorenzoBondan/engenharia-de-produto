package br.com.todeschini.persistence.util;

import java.util.HashMap;
import java.util.Map;

public class AttributeMappingsUtil {

    @SafeVarargs
    public static Map<String, Class<?>> combineMappings(Map<String, Class<?>>... mappings) {
        Map<String, Class<?>> combinedMap = new HashMap<>();
        for (Map<String, Class<?>> map : mappings) {
            combinedMap.putAll(map);
        }
        return combinedMap;
    }
}

