package br.com.todeschini.webapi.config;

import br.com.todeschini.domain.metadata.DomainService;
import org.reflections.Reflections;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.beans.factory.support.GenericBeanDefinition;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanFactory implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {

        Reflections reflections = new Reflections("br.com.todeschini.domain");
        reflections.getTypesAnnotatedWith(DomainService.class).forEach(c -> {
            GenericBeanDefinition gbd = new GenericBeanDefinition();
            gbd.setBeanClass(c);
            ((DefaultListableBeanFactory) beanFactory).registerBeanDefinition(c.getSimpleName(), gbd);
        });
    }
}
